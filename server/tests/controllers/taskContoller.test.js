// tests/controllers/taskController.test.js
const TaskController = require('../../controllers/taskController.js');
const formatStatusForFilter = require('../../utils/formatStatusForFilter.js');
const formatStatusForSort = require('../../utils/formatStatusForSort.js');

// Mock dependencies
jest.mock('auto-bind', () => ({
  default: (self) => self,
}));
jest.mock('../../service/taskService.js');
jest.mock('../../utils/formatStatusForFilter.js');
jest.mock('../../utils/formatStatusForSort.js');

const TaskService = require('../../service/taskService.js');

describe('TaskController', () => {
  let taskController;
  let mockTaskService;

  let mockReq;
  let mockRes;
  let mockNext;

  const mockUserId = 1;
  const mockTaskId = '1';
  const mockGroupId = 1;
  const mockTaskName = 'Complete project';
  const mockStatus = 'pending';

  const mockTaskData = {
    id: 1,
    name: mockTaskName,
    userId: mockUserId,
    groupId: mockGroupId,
    status: mockStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh mock service
    mockTaskService = new TaskService();

    // Create controller with mock
    taskController = new TaskController(mockTaskService);

    // Setup request, response, next function mocks
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: mockUserId },
    };

    mockRes = {
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      // Arrange
      mockReq.body = { name: mockTaskName, groupId: mockGroupId };
      mockTaskService.createTask.mockResolvedValue(mockTaskData);

      // Act
      await taskController.createTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.createTask).toHaveBeenCalledWith(
        mockTaskName,
        mockUserId,
        mockGroupId
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockTaskData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should create task without groupId', async () => {
      // Arrange
      mockReq.body = { name: mockTaskName };
      const taskWithoutGroup = { ...mockTaskData, groupId: null };
      mockTaskService.createTask.mockResolvedValue(taskWithoutGroup);

      // Act
      await taskController.createTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.createTask).toHaveBeenCalledWith(mockTaskName, mockUserId, undefined);
      expect(mockRes.json).toHaveBeenCalledWith(taskWithoutGroup);
    });

    it('should handle create task error', async () => {
      // Arrange
      const error = new Error('Create failed');
      mockReq.body = { name: mockTaskName, groupId: mockGroupId };
      mockTaskService.createTask.mockRejectedValue(error);

      // Act
      await taskController.createTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.createTask).toHaveBeenCalledWith(
        mockTaskName,
        mockUserId,
        mockGroupId
      );
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTask', () => {
    const updateData = { name: 'Updated task', status: 'completed' };
    const updatedTask = { ...mockTaskData, ...updateData };

    it('should update task successfully', async () => {
      // Arrange
      mockReq.params = { id: mockTaskId };
      mockReq.body = updateData;
      mockTaskService.updateTask.mockResolvedValue(updatedTask);

      // Act
      await taskController.updateTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(mockTaskId, updateData, mockUserId);
      expect(mockRes.json).toHaveBeenCalledWith(updatedTask);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle update task error', async () => {
      // Arrange
      const error = new Error('Update failed');
      mockReq.params = { id: mockTaskId };
      mockReq.body = updateData;
      mockTaskService.updateTask.mockRejectedValue(error);

      // Act
      await taskController.updateTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(mockTaskId, updateData, mockUserId);
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('queryTasks', () => {
    const mockQueryResult = {
      count: 2,
      rows: [mockTaskData, { ...mockTaskData, id: 2, name: 'Buy groceries' }],
      limit: 9,
    };

    const mockSortedResult = {
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    };

    const mockFormattedStatus = 'pending';

    it('should query tasks with default pagination values', async () => {
      // Arrange
      mockReq.query = {};
      formatStatusForSort.mockReturnValue(mockSortedResult);
      formatStatusForFilter.mockReturnValue(undefined);
      mockTaskService.findTasksByOptions.mockResolvedValue(mockQueryResult);

      // Act
      await taskController.queryTasks(mockReq, mockRes, mockNext);

      // Assert
      expect(formatStatusForSort).toHaveBeenCalledWith(undefined, undefined);
      expect(formatStatusForFilter).toHaveBeenCalledWith(undefined);
      expect(mockTaskService.findTasksByOptions).toHaveBeenCalledWith({
        limit: 9,
        offset: 0,
        userId: mockUserId,
        sortBy: mockSortedResult.sortBy,
        sortOrder: mockSortedResult.sortOrder,
        status: undefined,
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockQueryResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should query tasks with custom pagination and filters', async () => {
      // Arrange
      mockReq.query = {
        limit: '20',
        page: '3',
        sortBy: 'name',
        sortOrder: 'ASC',
        status: 'pending',
      };
      formatStatusForSort.mockReturnValue({
        sortBy: 'name',
        sortOrder: 'ASC',
      });
      formatStatusForFilter.mockReturnValue('pending');
      mockTaskService.findTasksByOptions.mockResolvedValue(mockQueryResult);

      // Act
      await taskController.queryTasks(mockReq, mockRes, mockNext);

      // Assert
      expect(formatStatusForSort).toHaveBeenCalledWith('name', 'ASC');
      expect(formatStatusForFilter).toHaveBeenCalledWith('pending');
      expect(mockTaskService.findTasksByOptions).toHaveBeenCalledWith({
        limit: 20,
        offset: 40,
        userId: mockUserId,
        sortBy: 'name',
        sortOrder: 'ASC',
        status: 'pending',
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockQueryResult);
    });

    it('should handle invalid limit by defaulting to 9', async () => {
      // Arrange
      mockReq.query = {
        limit: 'invalid',
        page: '2',
      };
      formatStatusForSort.mockReturnValue(mockSortedResult);
      formatStatusForFilter.mockReturnValue(undefined);
      mockTaskService.findTasksByOptions.mockResolvedValue(mockQueryResult);

      // Act
      await taskController.queryTasks(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.findTasksByOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 9,
          offset: 9,
        })
      );
    });

    it('should handle query tasks error', async () => {
      // Arrange
      const error = new Error('Query failed');
      mockReq.query = {};
      formatStatusForSort.mockReturnValue(mockSortedResult);
      formatStatusForFilter.mockReturnValue(undefined);
      mockTaskService.findTasksByOptions.mockRejectedValue(error);

      // Act
      await taskController.queryTasks(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.findTasksByOptions).toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      // Arrange
      mockReq.params = { id: mockTaskId };
      mockTaskService.deleteTask.mockResolvedValue(true);

      // Act
      await taskController.deleteTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockRes.json).toHaveBeenCalledWith(true);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle delete task error', async () => {
      // Arrange
      const error = new Error('Delete failed');
      mockReq.params = { id: mockTaskId };
      mockTaskService.deleteTask.mockRejectedValue(error);

      // Act
      await taskController.deleteTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTask', () => {
    it('should get task by id successfully', async () => {
      // Arrange
      mockReq.params = { id: mockTaskId };
      mockTaskService.getTaskById.mockResolvedValue(mockTaskData);

      // Act
      await taskController.getTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockRes.json).toHaveBeenCalledWith(mockTaskData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle get task error', async () => {
      // Arrange
      const error = new Error('Get task failed');
      mockReq.params = { id: mockTaskId };
      mockTaskService.getTaskById.mockRejectedValue(error);

      // Act
      await taskController.getTask(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
