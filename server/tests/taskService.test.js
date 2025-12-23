const { Task, Group } = require("../models/indexModel.js");
const taskService = require("../service/taskService");
const groupService = require("../service/groupService.js");

jest.mock("../models/indexModel");
jest.mock("../service/groupService.js");

describe("Task test", () => {
  const modelTask = { id: 1, name: "nameTask", userId: 42, groupId: null, createAt: new Date(), updateAt: new Date() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Must create a task and return its data from the DB.", async () => {
    Task.create.mockResolvedValue({ ...modelTask });

    const result = await taskService.createTask("Task", 2, null);

    expect(result).toEqual({ ...modelTask });
    expect(Task.create).toHaveBeenCalledTimes(1);
    expect(Task.create).toHaveBeenCalledWith({
      name: "Task",
      userId: 2,
      groupId: null,
    });
  });
  it("Must find the task, change the data and save it ", async () => {
    const newName = "newTask";
    const mockTask = { ...modelTask };

    //mock that emulates the mutation of an object and its storage in the database
    mockTask.update = jest.fn().mockImplementation(function (updates) {
      Object.assign(this, updates);
      return this;
    });

    Task.findOne.mockResolvedValue({ ...mockTask });

    groupService.getOneGroup.mockResolvedValue({ name: "Group", userId: 2 });
    const result = await taskService.changeTask(1, { name: "newTask" }, 2);

    expect(Task.findOne).toHaveBeenCalledTimes(1);
    expect(Task.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 2 } });

    expect(result.update).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ...mockTask, name: newName, status: 0, groupId: undefined });
  });

  it("Must delete task", async () => {
    const id = 1;

    Task.destroy.mockResolvedValue(1);

    const result = await taskService.removeTask(id);

    expect(Task.destroy).toHaveBeenCalledTimes(1);
    expect(Task.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(1);
  });

  it("Must receive all tasks", async () => {
    const userId = 1;
    const limit = 2;
    const offset = 2;

    const allTask = [
      { ...modelTask, id: 1, name: "task1" },
      { ...modelTask, id: 2, name: "task2" },
      { ...modelTask, id: 3, name: "task3" },
      { ...modelTask, id: 4, name: "task4" },
    ];

    const params = { count: allTask.length, rows: allTask.slice(offset, offset + limit) };
    Task.findAndCountAll.mockResolvedValue(params);

    const result = await taskService.getAllTasks(limit, offset, userId);
    expect(result.count).toBe(4);
    expect(result.rows).toHaveLength(2);

    expect(result.rows[0]).toEqual(allTask[2]);

    expect(result).toEqual({ count: 4, rows: [allTask[2], allTask[3]] });
  });
});
