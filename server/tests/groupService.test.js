const groupService = require("../service/groupService");

jest.mock("../models/indexModel.js");
const { Group, Task } = require("../models/indexModel.js");

// Create - full oject
// update - full objet
// destroy - 1
// get - {count: length ,rows: objects[]}

describe("Group test", () => {
  const modelGroup = { id: 1, name: "Group", userId: 42, createAt: new Date(), updateAt: new Date() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Must create a group and return its data from the DB", async () => {
    const inputData = { ...modelGroup };

    Group.create.mockResolvedValue({ ...inputData });

    const result = await groupService.createGroup("Group", 42);

    expect(Group.create).toHaveBeenCalledTimes(1);

    expect(result).toEqual(inputData);

    expect(Group.create).toHaveBeenCalledWith({
      name: "Group",
      userId: 42,
    });
  });

  it("Must find the group, change the name and save", async () => {
    const newName = "New name2";
    const mockGroup = { ...modelGroup };

    //mock that emulates the mutation of an object and its storage in the database
    mockGroup.save = jest.fn().mockImplementation(function () {
      return this;
    });

    Group.findOne.mockResolvedValue({ ...mockGroup });

    const result = await groupService.changeGroup(1, newName, 1);

    expect(Group.findOne).toHaveBeenCalledTimes(1);
    expect(Group.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
    expect(result.save).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ ...mockGroup, name: newName });
    expect(result.name).toBe(newName);
  });

  it("must delete group", async () => {
    const id = 1;

    Group.destroy.mockResolvedValue(1);

    const result = await groupService.removeGroup(id);

    expect(Group.destroy).toHaveBeenCalledTimes(1);
    expect(Group.destroy).toHaveBeenCalledWith({ where: { id: 1 } });

    expect(result).toBe(1);
  });
  it("Should get all user groups", async () => {
    const userId = 1;
    const limit = 2;
    const offset = 2,
      sortBy = "id",
      sortOrder = "desc",
      page = 1;
    const modelTask = {
      id: 1,
      name: "nameTask",
      userId: 42,
      groupId: null,
      createAt: "2016-01-06",
      updateAt: "2016-01-06",
    };

    const allGroup = [
      { ...modelGroup },
      { ...modelGroup, id: 2, name: "group2" },
      { ...modelGroup, id: 3, name: "group3" },
      { ...modelGroup, id: 4, name: "group4", tasks: [modelTask] },
    ];

    const params = { count: allGroup.length, rows: allGroup.slice(offset, offset + limit) };
    Group.findAndCountAll.mockResolvedValue(params);

    const options = { limit, page, userId, sortBy, sortOrder, offset };
    const result = await groupService.getAllGroup(options);

    expect(result.count).toBe(4);
    expect(result.rows).toHaveLength(2);
    expect(Group.findAndCountAll).toHaveBeenCalledWith({
      include: [
        {
          model: Task,
          separate: true,
          order: [["id", "DESC"]],
        },
      ],
      where: { userId: 1 },
      limit: 2,
      offset: 2,
      order: [["id", "desc"]],
    });

    expect(result).toEqual({ count: 4, rows: [allGroup[2], allGroup[3]], currentPage: page, limit: 2 });
    expect(result.rows[0].id).toBe(3);
    expect(result.rows[1].id).toBe(4);
    expect(result.rows[1]).toStrictEqual({
      ...modelGroup,
      id: 4,
      name: "group4",
      tasks: [
        {
          id: 1,
          name: "nameTask",
          userId: 42,
          groupId: null,
          createAt: "2016-01-06",
          updateAt: "2016-01-06",
        },
      ],
    });
  });
});
