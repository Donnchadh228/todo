const Group = require("../models/GroupModel");
const groupService = require("../service/groupService");

jest.mock("../models/GroupModel");

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

    Group.create.mockResolvedValue(inputData);

    const result = await groupService.createGroup("Group", 42);

    expect(Group.create).toHaveBeenCalledTimes(1);

    expect(Group.create).toHaveBeenCalledWith({
      name: "Group",
      userId: 42,
    });

    expect(result).toEqual(inputData);
  });

  it("Must find the group, change the name and save", async () => {
    const newName = "New name2";
    const mockGroup = { ...modelGroup };

    //mock that emulates the mutation of an object and its storage in the database
    const mockSave = jest.fn().mockImplementation(() => {
      mockGroup.name = newName;
      return mockGroup;
    });

    mockGroup.save = mockSave;

    Group.findByPk.mockResolvedValue(mockGroup);

    const result = await groupService.changeGroup(1, "New name2");

    expect(Group.findByPk).toHaveBeenCalledTimes(1);
    expect(Group.findByPk).toHaveBeenCalledWith(1);

    expect(mockSave).toHaveBeenCalledTimes(1);
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
    const offset = 2;

    const allGroup = [
      { ...modelGroup },
      { ...modelGroup, id: 2, name: "group2" },
      { ...modelGroup, id: 3, name: "group3" },
      { ...modelGroup, id: 4, name: "group4" },
    ];

    const params = { count: allGroup.length, rows: allGroup.slice(offset, offset + limit) };
    Group.findAndCountAll.mockResolvedValue(params);

    const result = await groupService.getAllGroup(limit, offset, userId);

    expect(result.count).toBe(4);
    expect(result.rows).toHaveLength(2);

    expect(result.rows[0].id).toBe(3);
    expect(result.rows[1].id).toBe(4);
  });
});
