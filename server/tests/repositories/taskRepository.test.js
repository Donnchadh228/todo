const { Group, Task } = require('../../models/indexModel.js');
const TaskRepository = require('../../repositories/taskRepository.js');

jest.mock('../../models/indexModel.js');

describe('TaskRepository', () => {
  let taskRepository;
  const mockUserId = 42;
  const mockTaskId = 1;
  const mockGroupId = 5;
  const mockTaskName = 'Complete project';

  const mockTaskData = {
    id: mockTaskId,
    name: mockTaskName,
    userId: mockUserId,
    groupId: mockGroupId,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    taskRepository = new TaskRepository();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      // Arrange
      Task.create.mockResolvedValue(mockTaskData);

      // Act
      const result = await taskRepository.create(mockTaskName, mockUserId, mockGroupId);

      // Assert
      expect(Task.create).toHaveBeenCalledTimes(1);
      expect(Task.create).toHaveBeenCalledWith({
        name: mockTaskName,
        userId: mockUserId,
        groupId: mockGroupId,
      });
      expect(result).toEqual(mockTaskData);
    });

    it('should create a task without groupId (null groupId)', async () => {
      // Arrange
      const taskWithoutGroup = { ...mockTaskData, groupId: null };
      Task.create.mockResolvedValue(taskWithoutGroup);

      // Act
      const result = await taskRepository.create(mockTaskName, mockUserId, null);

      // Assert
      expect(Task.create).toHaveBeenCalledWith({
        name: mockTaskName,
        userId: mockUserId,
        groupId: null,
      });
      expect(result.groupId).toBeNull();
    });

    it('should handle creation errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Task.create.mockRejectedValue(error);

      // Act & Assert
      await expect(taskRepository.create(mockTaskName, mockUserId, mockGroupId)).rejects.toThrow(
        'Database error'
      );
      expect(Task.create).toHaveBeenCalledTimes(1);
    });

    it('should handle duplicate task name', async () => {
      // Arrange
      const error = new Error('Validation error');
      Task.create.mockRejectedValue(error);

      // Act & Assert
      await expect(taskRepository.create(mockTaskName, mockUserId, mockGroupId)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should find task by id and userId successfully', async () => {
      // Arrange
      Task.findOne.mockResolvedValue(mockTaskData);
      // Act

      const result = await taskRepository.findById(mockTaskId, mockUserId);

      // Assert
      expect(Task.findOne).toHaveBeenCalledTimes(1);
      expect(Task.findOne).toHaveBeenCalledWith({
        where: { id: mockTaskId, userId: mockUserId },
      });
      expect(result).toEqual(mockTaskData);
    });

    it('should return null when task not found', async () => {
      // Arrange
      Task.findOne.mockResolvedValue(null);

      // Act
      const result = await taskRepository.findById(999, mockUserId);

      // Assert
      expect(Task.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return null when userId does not match', async () => {
      // Arrange
      Task.findOne.mockResolvedValue(null);

      // Act
      const result = await taskRepository.findById(mockTaskId, 999);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle database error', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      Task.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(taskRepository.findById(mockTaskId, mockUserId)).rejects.toThrow(
        'Database connection failed'
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

    const mockGroups = [{ name: 'Work' }, { name: 'Personal' }];

    const mockTasksWithGroups = {
      count: 3,
      rows: [
        { ...mockTaskData, Group: mockGroups[0] },
        { ...mockTaskData, id: 2, name: 'Buy groceries', Group: mockGroups[1] },
        { ...mockTaskData, id: 3, name: 'Call doctor', Group: mockGroups[0] },
      ],
    };

    it('should find and count tasks with groups successfully', async () => {
      // Arrange
      Task.findAndCountAll.mockResolvedValue(mockTasksWithGroups);

      // Act
      const result = await taskRepository.findAndCount(mockOptions);

      // Assert
      expect(Task.findAndCountAll).toHaveBeenCalledTimes(1);
      expect(Task.findAndCountAll).toHaveBeenCalledWith({
        where: mockOptions.whereClause,
        limit: mockOptions.limit,
        offset: mockOptions.offset,
        include: [{ model: Group, attributes: ['name'] }],
        order: [[mockOptions.sortBy, mockOptions.sortOrder]],
        distinct: true,
      });
      expect(result).toEqual(mockTasksWithGroups);
      expect(result.count).toBe(3);
      expect(result.rows).toHaveLength(3);
      expect(result.rows[0].Group).toBeDefined();
    });

    it('should handle empty result', async () => {
      // Arrange
      const emptyResult = { count: 0, rows: [] };
      Task.findAndCountAll.mockResolvedValue(emptyResult);

      // Act
      const result = await taskRepository.findAndCount({
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

    it('should handle pagination correctly', async () => {
      // Arrange
      const paginationOptions = {
        whereClause: { userId: mockUserId },
        limit: 5,
        offset: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };
      Task.findAndCountAll.mockResolvedValue({ count: 20, rows: [] });

      // Act
      await taskRepository.findAndCount(paginationOptions);

      // Assert
      expect(Task.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
          offset: 10,
        })
      );
    });

    it('should handle different sort options', async () => {
      // Arrange
      const sortOptions = {
        whereClause: { userId: mockUserId },
        limit: 10,
        offset: 0,
        sortBy: 'name',
        sortOrder: 'ASC',
      };
      Task.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      // Act
      await taskRepository.findAndCount(sortOptions);

      // Assert
      expect(Task.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['name', 'ASC']],
        })
      );
    });

    it('should filter by groupId', async () => {
      // Arrange
      const groupFilterOptions = {
        whereClause: { userId: mockUserId, groupId: mockGroupId },
        limit: 10,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      };
      Task.findAndCountAll.mockResolvedValue({ count: 2, rows: [] });

      // Act
      await taskRepository.findAndCount(groupFilterOptions);

      // Assert
      expect(Task.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: mockUserId, groupId: mockGroupId },
        })
      );
    });

    it('should handle findAndCount errors', async () => {
      // Arrange
      const error = new Error('Database query failed');
      Task.findAndCountAll.mockRejectedValue(error);

      // Act & Assert
      await expect(taskRepository.findAndCount(mockOptions)).rejects.toThrow(
        'Database query failed'
      );
    });
  });

  describe('update', () => {
    const updateData = { name: 'Updated task name', completed: true };

    it('should update task successfully', async () => {
      // Arrange
      const updatedTask = { ...mockTaskData, ...updateData };
      Task.update.mockResolvedValue([1, [updatedTask]]);

      // Act
      const result = await taskRepository.update(mockTaskId, mockUserId, updateData);

      // Assert
      expect(Task.update).toHaveBeenCalledTimes(1);
      expect(Task.update).toHaveBeenCalledWith(updateData, {
        where: { id: mockTaskId, userId: mockUserId },
        returning: true,
      });
      expect(result).toEqual(updatedTask);
    });

    it('should update only specific fields', async () => {
      // Arrange
      const partialUpdate = { completed: true };
      const updatedTask = { ...mockTaskData, completed: true };
      Task.update.mockResolvedValue([1, [updatedTask]]);

      // Act
      const result = await taskRepository.update(mockTaskId, mockUserId, partialUpdate);

      // Assert
      expect(Task.update).toHaveBeenCalledWith(partialUpdate, expect.any(Object));
      expect(result.completed).toBe(true);
      expect(result.name).toBe(mockTaskName);
    });

    it('should return null when task to update not found', async () => {
      // Arrange
      Task.update.mockResolvedValue([0, []]);

      // Act
      const result = await taskRepository.update(999, mockUserId, updateData);

      // Assert
      expect(Task.update).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return null when userId does not match', async () => {
      // Arrange
      Task.update.mockResolvedValue([0, []]);

      // Act
      const result = await taskRepository.update(mockTaskId, 999, updateData);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle update errors', async () => {
      // Arrange
      const error = new Error('Update failed');
      Task.update.mockRejectedValue(error);

      // Act & Assert
      await expect(taskRepository.update(mockTaskId, mockUserId, updateData)).rejects.toThrow(
        'Update failed'
      );
    });

    it('should handle empty update data', async () => {
      // Arrange
      const emptyData = {};
      Task.update.mockResolvedValue([1, [mockTaskData]]);

      // Act
      const result = await taskRepository.update(mockTaskId, mockUserId, emptyData);

      // Assert
      expect(Task.update).toHaveBeenCalledWith(emptyData, expect.any(Object));
      expect(result).toEqual(mockTaskData);
    });
  });

  describe('delete', () => {
    it('should delete task successfully', async () => {
      // Arrange
      Task.destroy.mockResolvedValue(1);

      // Act
      const result = await taskRepository.delete(mockTaskId, mockUserId);

      // Assert
      expect(Task.destroy).toHaveBeenCalledTimes(1);
      expect(Task.destroy).toHaveBeenCalledWith({
        where: { id: mockTaskId, userId: mockUserId },
      });
      expect(result).toBe(true);
    });

    it('should return false when task to delete not found', async () => {
      // Arrange
      Task.destroy.mockResolvedValue(0);

      // Act
      const result = await taskRepository.delete(999, mockUserId);

      // Assert
      expect(Task.destroy).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should return false when userId does not match', async () => {
      // Arrange
      Task.destroy.mockResolvedValue(0);

      // Act
      const result = await taskRepository.delete(mockTaskId, 999);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle delete errors', async () => {
      // Arrange
      const error = new Error('Delete failed');
      Task.destroy.mockRejectedValue(error);

      // Act & Assert
      await expect(taskRepository.delete(mockTaskId, mockUserId)).rejects.toThrow('Delete failed');
    });
  });
});
