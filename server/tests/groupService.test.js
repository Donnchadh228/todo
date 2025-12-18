const Group = require("../models/GroupModel");
const groupService = require("../service/groupService");

jest.mock("../models/GroupModel");

// Create - full oject
// update - full objet
// destroy - 1 or 0
// get - {count: length ,objects[]}

describe("Group test", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const modelGroup = { id: 1, name: "Группа", userId: 42, createAt: new Date(), updateAt: new Date() };

  it("Должен создать группу и вернуть её данные от БД", async () => {
    const inputData = { ...modelGroup };

    Group.create.mockResolvedValue(inputData);

    const result = await groupService.createGroup("Группа", 42);

    expect(Group.create).toHaveBeenCalledTimes(1);

    expect(Group.create).toHaveBeenCalledWith({
      name: "Группа",
      userId: 42,
    });

    expect(result).toEqual(inputData);
  });

  it("Должен найти группу, изменить имя и сохранить", async () => {
    const newName = "New name2";
    const mockGroup = { ...modelGroup };

    const mockSave = jest.fn().mockImplementation(() => {
      mockGroup.name = newName;
      return mockGroup;
    });

    mockGroup.save = mockSave;

    Group.findByPk.mockResolvedValue(mockGroup);

    const result = await groupService.changeGroup(1, newName);

    expect(Group.findByPk).toHaveBeenCalledTimes(1);
    expect(Group.findByPk).toHaveBeenCalledWith(1);

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(result.name).toBe(newName);
  });
  it("Должен удалить группу", async () => {
    const id = 1;
    Group.destroy.mockResolvedValue(1);

    const result = await groupService.removeGroup(id);
    expect(Group.destroy).toHaveBeenCalledTimes(1);

    expect(Group.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(1);
  });
  it("Должен получить все группы польователя", async () => {
    const userId = 1;
    const limit = 2;
    const offset = 2;

    const allGroup = [
      { ...modelGroup },
      { ...modelGroup, id: 2, name: "group2" },
      { ...modelGroup, id: 3, name: "group3" },
      { ...modelGroup, id: 4, name: "group4" },
    ];

    Group.findAndCountAll.mockResolvedValue({ count: allGroup.length, rows: allGroup.slice(offset, offset + limit) });

    const result = await groupService.getAllGroup(limit, offset, userId);
    console.log(result);

    expect(result.count).toBe(4);
    expect(result.rows).toHaveLength(2);

    expect(result.rows[0].id).toBe(3);
    expect(result.rows[1].id).toBe(4);
  });
});
