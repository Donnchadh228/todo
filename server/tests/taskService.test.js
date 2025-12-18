const Task = require("../models/TaskModel");
const taskService = require("../service/taskService");

jest.mock("../models/TaskModel");

describe("Task test", () => {
  const modelTask = { id: 1, name: "nameTask", userId: 42, groupId: null, createAt: new Date(), updateAt: new Date() };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Must create a task and return its data from the DB.", async () => {
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
  test("Must find the task, change the data and save it ", async () => {
    const name = "newTask";
    const mockTask = { ...modelTask };

    const mockUpdate = jest.fn().mockImplementation(() => {
      mockTask.name = name;
      return mockTask;
    });

    mockTask.update = mockUpdate;

    Task.findByPk.mockResolvedValue(mockTask);

    const result = await taskService.changeTask(1, { name: "newTask" });

    expect(Task.findByPk).toHaveBeenCalledTimes(1);
    expect(Task.findByPk).toHaveBeenCalledWith(1);

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(result.name).toBe("newTask");
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
    Task.findAndCountAll.mockResolvedValue({ count: allTask.length, rows: allTask.slice(offset, offset + limit) });

    const result = await taskService.getAllTasks(limit, offset, userId);
    expect(result.count).toBe(4);
    expect(result.rows).toHaveLength(2);

    expect(result.rows[0]).toEqual(allTask[2]);

    expect(result.rows).toEqual([allTask[2], allTask[3]]);
  });
});
