const { Group, Task } = require('../../models/indexModel.js');
const GroupRepository = require('../../repositories/groupRepository.js');

jest.mock('../../models/indexModel.js');

// Create - full oject
// update - full objet
// destroy - 1
// get - {count: length ,rows: objects[]}

describe('GroupRepository', () => {
  let groupRepository;
  const mockUserId = 42;
  const mockGroupId = 1;
  const mockGroupName = 'Group';

  const mockGroupData = {
    id: mockGroupId,
    name: mockGroupName,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    groupRepository = new GroupRepository();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a new group successfully', async () => {
      // Arrange
      Group.create.mockResolvedValue(mockGroupData);

      // Act
      const result = await groupRepository.create(mockGroupName, mockUserId);

      // Assert
      expect(Group.create).toHaveBeenCalledTimes(1);
      expect(Group.create).toHaveBeenCalledWith({
        name: mockGroupName,
        userId: mockUserId,
      });
      expect(result).toEqual(mockGroupData);
    });

    it('should handle creation errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Group.create.mockRejectedValue(error);

      // Act & Assert
      await expect(groupRepository.create(mockGroupName, mockUserId)).rejects.toThrow(
        'Database error'
      );
      expect(Group.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should find group by id and userId successfully', async () => {
      // Arrange
      Group.findOne.mockResolvedValue(mockGroupData);

      // Act
      const result = await groupRepository.findById(mockGroupId, mockUserId);

      // Assert
      expect(Group.findOne).toHaveBeenCalledTimes(1);
      expect(Group.findOne).toHaveBeenCalledWith({
        where: { id: mockGroupId, userId: mockUserId },
      });

      expect(result).toEqual(mockGroupData);
    });

    it('should return null when group not found', async () => {
      // Arrange
      Group.findOne.mockResolvedValue(null);

      // Act
      const result = await groupRepository.findById(999, mockUserId);

      // Assert
      expect(Group.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const newGroupName = 'Updated Group Name';

    it('should update group successfully', async () => {
      // Arrange
      const updatedGroup = { ...mockGroupData, name: newGroupName };
      Group.update.mockResolvedValue([1, [updatedGroup]]);

      // Act
      const result = await groupRepository.update(mockGroupId, mockUserId, newGroupName);

      // Assert
      expect(Group.update).toHaveBeenCalledTimes(1);
      expect(Group.update).toHaveBeenCalledWith(
        { name: newGroupName },
        { where: { id: mockGroupId, userId: mockUserId }, returning: true }
      );
      expect(result).toEqual(updatedGroup);
    });

    it('should return null when group to update not found', async () => {
      // Arrange
      Group.update.mockResolvedValue([0, []]);

      // Act
      const result = await groupRepository.update(999, mockUserId, newGroupName);

      // Assert
      expect(Group.update).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should handle update errors', async () => {
      // Arrange
      const error = new Error('Update failed');
      Group.update.mockRejectedValue(error);

      // Act & Assert
      await expect(groupRepository.update(mockGroupId, mockUserId, newGroupName)).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('delete', () => {
    it('should delete group successfully', async () => {
      // Arrange
      Group.destroy.mockResolvedValue(1);

      // Act
      const result = await groupRepository.delete(mockGroupId, mockUserId);

      // Assert
      expect(Group.destroy).toHaveBeenCalledTimes(1);
      expect(Group.destroy).toHaveBeenCalledWith({
        where: { id: mockGroupId, userId: mockUserId },
      });
      expect(result).toBe(true);
    });

    it('should return false when group to delete not found', async () => {
      // Arrange
      Group.destroy.mockResolvedValue(0);

      // Act
      const result = await groupRepository.delete(999, mockUserId);

      // Assert
      expect(Group.destroy).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should handle delete errors', async () => {
      // Arrange
      const error = new Error('Delete failed');
      Group.destroy.mockRejectedValue(error);

      // Act & Assert
      await expect(groupRepository.delete(mockGroupId, mockUserId)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('findAndCount', () => {
    const mockOptions = {
      whereClause: { userId: mockUserId },
      limit: 10,
      offset: 0,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    };

    const mockTasks = [{ name: 'Task 1' }, { name: 'Task 2' }];

    const mockGroupsWithTasks = {
      count: 2,
      rows: [
        { ...mockGroupData, Tasks: mockTasks },
        { ...mockGroupData, id: 2, name: 'Group 2', Tasks: [mockTasks[0]] },
      ],
    };

    it('should find and count groups with tasks successfully', async () => {
      // Arrange
      Group.findAndCountAll.mockResolvedValue(mockGroupsWithTasks);

      // Act
      const result = await groupRepository.findAndCount(mockOptions);

      // Assert
      expect(Group.findAndCountAll).toHaveBeenCalledTimes(1);
      expect(Group.findAndCountAll).toHaveBeenCalledWith({
        where: mockOptions.whereClause,
        limit: mockOptions.limit,
        offset: mockOptions.offset,
        include: [{ model: Task, attributes: ['name'] }],
        order: [[mockOptions.sortBy, mockOptions.sortOrder]],
        distinct: true,
      });
      expect(result).toEqual(mockGroupsWithTasks);
      expect(result.count).toBe(2);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].Tasks).toHaveLength(2);
    });

    it('should handle empty result', async () => {
      // Arrange
      const emptyResult = { count: 0, rows: [] };
      Group.findAndCountAll.mockResolvedValue(emptyResult);

      // Act
      const result = await groupRepository.findAndCount({
        whereClause: { userId: 999 },
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });

      // Assert
      expect(result.count).toBe(0);
      expect(result.rows).toHaveLength(0);
    });

    it('should handle different sort options', async () => {
      // Arrange
      const sortOptions = {
        whereClause: { userId: mockUserId },
        limit: 5,
        offset: 10,
        sortBy: 'name',
        sortOrder: 'ASC',
      };
      Group.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      // Act
      await groupRepository.findAndCount(sortOptions);

      // Assert
      expect(Group.findAndCountAll).toHaveBeenCalledWith({
        where: sortOptions.whereClause,
        limit: sortOptions.limit,
        offset: sortOptions.offset,
        include: [{ model: Task, attributes: ['name'] }],
        order: [[sortOptions.sortBy, sortOptions.sortOrder]],
        distinct: true,
      });
    });

    it('should handle findAndCount errors', async () => {
      // Arrange
      const error = new Error('Database query failed');
      Group.findAndCountAll.mockRejectedValue(error);

      // Act & Assert
      await expect(groupRepository.findAndCount(mockOptions)).rejects.toThrow(
        'Database query failed'
      );
    });
  });
});
