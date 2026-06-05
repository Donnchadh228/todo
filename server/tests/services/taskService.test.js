// tests/service/taskService.test.js
const TaskService = require('../../service/taskService.js');
const ApiError = require('../../exceptions/apiError.js');

// Mock dependencies
jest.mock('../../repositories/taskRepository.js');
jest.mock('../../service/groupService.js');

const TaskRepository = require('../../repositories/taskRepository.js');
const GroupService = require('../../service/groupService.js');

describe('TaskService', () => {
  let taskService;
  let mockTaskRepository;
  let mockGroupService;

  const mockUserId = 1;
  const mockTaskId = 1;
  const mockGroupId = 1;
  const mockTaskName = 'Complete project';

  const mockTaskData = {
    id: mockTaskId,
    name: mockTaskName,
    userId: mockUserId,
    groupId: mockGroupId,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGroupData = {
    id: mockGroupId,
    name: 'Work',
    userId: mockUserId,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh mocks
    mockTaskRepository = new TaskRepository();
    mockGroupService = new GroupService();

    // Create service with mocks
    taskService = new TaskService(mockTaskRepository, mockGroupService);
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      // Arrange
      mockTaskRepository.create.mockResolvedValue(mockTaskData);

      // Act
      const result = await taskService.createTask(mockTaskName, mockUserId, mockGroupId);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalledWith(mockTaskName, mockUserId, mockGroupId);
      expect(result).toEqual(mockTaskData);
    });

    it('should create a task without groupId', async () => {
      // Arrange
      const taskWithoutGroup = { ...mockTaskData, groupId: null };
      mockTaskRepository.create.mockResolvedValue(taskWithoutGroup);

      // Act
      const result = await taskService.createTask(mockTaskName, mockUserId, null);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalledWith(mockTaskName, mockUserId, null);
      expect(result.groupId).toBeNull();
    });

    it('should handle repository error during creation', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTaskRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(taskService.createTask(mockTaskName, mockUserId, mockGroupId)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('updateTask', () => {
    const updateData = { name: 'Updated task', status: 'completed' };

    it('should update a task successfully without changing group', async () => {
      // Arrange
      const updatedTask = { ...mockTaskData, ...updateData };
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      // Act
      const result = await taskService.updateTask(mockTaskId, updateData, mockUserId);

      // Assert
      expect(mockTaskRepository.update).toHaveBeenCalledWith(mockTaskId, mockUserId, updateData);
      expect(mockGroupService.getGroupById).not.toHaveBeenCalled();
      expect(result).toEqual(updatedTask);
    });

    it('should update a task with group change when group exists', async () => {
      // Arrange
      const updateWithGroup = { ...updateData, groupId: 2 };
      const updatedTask = { ...mockTaskData, ...updateWithGroup };
      mockGroupService.getGroupById.mockResolvedValue({ ...mockGroupData, id: 2 });
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      // Act
      const result = await taskService.updateTask(mockTaskId, updateWithGroup, mockUserId);

      // Assert
      expect(mockGroupService.getGroupById).toHaveBeenCalledWith(2, mockUserId);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        mockTaskId,
        mockUserId,
        updateWithGroup
      );
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFound error when new group does not exist', async () => {
      // Arrange
      const updateWithGroup = { groupId: 999 };

      // Act & Assert
      await expect(taskService.updateTask(mockTaskId, updateWithGroup, mockUserId)).rejects.toThrow(
        ApiError
      );
      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFound error when task to update does not exist', async () => {
      // Arrange
      mockTaskRepository.update.mockResolvedValue(null);

      // Act & Assert
      await expect(taskService.updateTask(mockTaskId, updateData, mockUserId)).rejects.toThrow(
        ApiError
      );
      await expect(taskService.updateTask(mockTaskId, updateData, mockUserId)).rejects.toThrow(
        'Not Found'
      );
    });

    it('should handle repository error during update', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTaskRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(taskService.updateTask(mockTaskId, updateData, mockUserId)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('findTasksByOptions', () => {
    const mockOptions = {
      limit: 10,
      offset: 0,
      userId: mockUserId,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      status: 'pending',
    };

    const mockTasksResult = {
      count: 2,
      rows: [mockTaskData, { ...mockTaskData, id: 2, name: 'Buy groceries' }],
    };

    it('should find tasks with status filter successfully', async () => {
      // Arrange
      mockTaskRepository.findAndCount.mockResolvedValue(mockTasksResult);

      // Act
      const result = await taskService.findTasksByOptions(mockOptions);

      // Assert
      expect(mockTaskRepository.findAndCount).toHaveBeenCalledWith({
        whereClause: { userId: mockUserId, status: 'pending' },
        limit: mockOptions.limit,
        offset: mockOptions.offset,
        sortBy: mockOptions.sortBy,
        sortOrder: mockOptions.sortOrder,
      });
      expect(result).toEqual({
        ...mockTasksResult,
        limit: mockOptions.limit,
      });
      expect(result.count).toBe(2);
      expect(result.rows).toHaveLength(2);
      expect(result.limit).toBe(10);
    });

    it('should find tasks without status filter when status is undefined', async () => {
      // Arrange
      const optionsWithoutStatus = { ...mockOptions, status: undefined };
      mockTaskRepository.findAndCount.mockResolvedValue(mockTasksResult);

      // Act
      const result = await taskService.findTasksByOptions(optionsWithoutStatus);

      // Assert
      expect(mockTaskRepository.findAndCount).toHaveBeenCalledWith({
        whereClause: { userId: mockUserId },
        limit: mockOptions.limit,
        offset: mockOptions.offset,
        sortBy: mockOptions.sortBy,
        sortOrder: mockOptions.sortOrder,
      });
      expect(result).toBeDefined();
    });

    it('should find tasks with different sort options', async () => {
      // Arrange
      const customOptions = {
        limit: 20,
        offset: 10,
        userId: mockUserId,
        sortBy: 'name',
        sortOrder: 'ASC',
        status: 'completed',
      };
      mockTaskRepository.findAndCount.mockResolvedValue(mockTasksResult);

      // Act
      const result = await taskService.findTasksByOptions(customOptions);

      // Assert
      expect(mockTaskRepository.findAndCount).toHaveBeenCalledWith({
        whereClause: { userId: mockUserId, status: 'completed' },
        limit: 20,
        offset: 10,
        sortBy: 'name',
        sortOrder: 'ASC',
      });
      expect(result.limit).toBe(20);
    });

    it('should handle empty result', async () => {
      // Arrange
      const emptyResult = { count: 0, rows: [] };
      mockTaskRepository.findAndCount.mockResolvedValue(emptyResult);

      // Act
      const result = await taskService.findTasksByOptions(mockOptions);

      // Assert
      expect(result.count).toBe(0);
      expect(result.rows).toHaveLength(0);
      expect(result.limit).toBe(10);
    });

    it('should handle repository error during find', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTaskRepository.findAndCount.mockRejectedValue(error);

      // Act & Assert
      await expect(taskService.findTasksByOptions(mockOptions)).rejects.toThrow('Database error');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      // Arrange
      mockTaskRepository.delete.mockResolvedValue(true);

      // Act
      const result = await taskService.deleteTask(mockTaskId, mockUserId);

      // Assert
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(result).toBe(true);
    });

    it('should throw NotFound error when task to delete does not exist', async () => {
      // Arrange
      mockTaskRepository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(taskService.deleteTask(mockTaskId, mockUserId)).rejects.toThrow(ApiError);
      await expect(taskService.deleteTask(mockTaskId, mockUserId)).rejects.toThrow('Not Found');
    });

    it('should handle repository error during delete', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTaskRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(taskService.deleteTask(mockTaskId, mockUserId)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getTaskById', () => {
    it('should get task by id successfully', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(mockTaskData);

      // Act
      const result = await taskService.getTaskById(mockTaskId, mockUserId);

      // Assert
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(result).toEqual(mockTaskData);
    });

    it('should throw NotFound error when task not found', async () => {
      // Arrange
      mockTaskRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(taskService.getTaskById(mockTaskId, mockUserId)).rejects.toThrow(ApiError);
      await expect(taskService.getTaskById(mockTaskId, mockUserId)).rejects.toThrow('Not Found');
    });

    it('should handle repository error during find', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTaskRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(taskService.getTaskById(mockTaskId, mockUserId)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
