// tests/controllers/groupController.test.js
const GroupController = require('../../controllers/groupController.js');
const formatStatusForSort = require('../../utils/formatStatusForSort.js');

// Mock dependencies
jest.mock('auto-bind', () => ({
  default: (self) => self,
}));
jest.mock('../../service/groupService.js');
jest.mock('../../utils/formatStatusForSort.js');

const GroupService = require('../../service/groupService.js');

describe('GroupController', () => {
  let groupController;
  let mockGroupService;

  let mockReq;
  let mockRes;
  let mockNext;

  const mockUserId = 1;
  const mockGroupId = '1';
  const mockGroupName = 'Work';

  const mockGroupData = {
    id: 1,
    name: mockGroupName,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh mock service
    mockGroupService = new GroupService();

    // Create controller with mock
    groupController = new GroupController(mockGroupService);

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

  describe('createGroup', () => {
    it('should create group successfully', async () => {
      // Arrange
      mockReq.body = { name: mockGroupName };
      mockGroupService.createGroup.mockResolvedValue(mockGroupData);

      // Act
      await groupController.createGroup(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.createGroup).toHaveBeenCalledWith(mockGroupName, mockUserId);
      expect(mockRes.json).toHaveBeenCalledWith(mockGroupData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle create group error', async () => {
      // Arrange
      const error = new Error('Create failed');
      mockReq.body = { name: mockGroupName };
      mockGroupService.createGroup.mockRejectedValue(error);

      // Act
      await groupController.createGroup(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.createGroup).toHaveBeenCalledWith(mockGroupName, mockUserId);
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteGroup', () => {
    it('should delete group successfully', async () => {
      // Arrange
      mockReq.params = { id: mockGroupId };
      mockGroupService.deleteGroup.mockResolvedValue(true);

      // Act
      await groupController.deleteGroup(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.deleteGroup).toHaveBeenCalledWith(mockGroupId, mockUserId);
      expect(mockRes.json).toHaveBeenCalledWith(true);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle delete group error', async () => {
      // Arrange
      const error = new Error('Delete failed');
      mockReq.params = { id: mockGroupId };
      mockGroupService.deleteGroup.mockRejectedValue(error);

      // Act
      await groupController.deleteGroup(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.deleteGroup).toHaveBeenCalledWith(mockGroupId, mockUserId);
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('queryGroups', () => {
    const mockQueryResult = {
      count: 2,
      rows: [mockGroupData, { ...mockGroupData, id: 2, name: 'Personal' }],
      limit: 8,
      currentPage: 1,
    };

    const mockSortedResult = {
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    };

    it('should query groups with default pagination values', async () => {
      // Arrange
      mockReq.query = {};
      formatStatusForSort.mockReturnValue(mockSortedResult);
      mockGroupService.findGroupsByOptions.mockResolvedValue(mockQueryResult);

      // Act
      await groupController.queryGroups(mockReq, mockRes, mockNext);

      // Assert
      expect(formatStatusForSort).toHaveBeenCalledWith(undefined, undefined);
      expect(mockGroupService.findGroupsByOptions).toHaveBeenCalledWith({
        limit: 8,
        offset: 0,
        userId: mockUserId,
        page: 1,
        sortBy: mockSortedResult.sortBy,
        sortOrder: mockSortedResult.sortOrder,
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockQueryResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should query groups with custom pagination values', async () => {
      // Arrange
      mockReq.query = {
        limit: '20',
        page: '3',
        sortBy: 'name',
        sortOrder: 'ASC',
      };
      formatStatusForSort.mockReturnValue({
        sortBy: 'name',
        sortOrder: 'ASC',
      });
      mockGroupService.findGroupsByOptions.mockResolvedValue(mockQueryResult);

      // Act
      await groupController.queryGroups(mockReq, mockRes, mockNext);

      // Assert
      expect(formatStatusForSort).toHaveBeenCalledWith('name', 'ASC');
      expect(mockGroupService.findGroupsByOptions).toHaveBeenCalledWith({
        limit: 20,
        offset: 40,
        userId: mockUserId,
        page: 3,
        sortBy: 'name',
        sortOrder: 'ASC',
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockQueryResult);
    });

    it('should handle invalid page number by defaulting to 1', async () => {
      // Arrange
      mockReq.query = {
        page: 'invalid',
        limit: '10',
      };
      formatStatusForSort.mockReturnValue(mockSortedResult);
      mockGroupService.findGroupsByOptions.mockResolvedValue(mockQueryResult);

      // Act
      await groupController.queryGroups(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.findGroupsByOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          offset: 0,
        })
      );
    });

    it('should handle invalid limit by defaulting to 8', async () => {
      // Arrange
      mockReq.query = {
        limit: 'invalid',
        page: '2',
      };
      formatStatusForSort.mockReturnValue(mockSortedResult);
      mockGroupService.findGroupsByOptions.mockResolvedValue(mockQueryResult);

      // Act
      await groupController.queryGroups(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.findGroupsByOptions).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 8,
          offset: 8,
        })
      );
    });

    it('should handle query groups error', async () => {
      // Arrange
      const error = new Error('Query failed');
      mockReq.query = {};
      formatStatusForSort.mockReturnValue(mockSortedResult);
      mockGroupService.findGroupsByOptions.mockRejectedValue(error);

      // Act
      await groupController.queryGroups(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.findGroupsByOptions).toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateGroup', () => {
    const updatedGroupData = { ...mockGroupData, name: 'Updated Work' };

    it('should update group successfully', async () => {
      // Arrange
      mockReq.params = { id: mockGroupId };
      mockReq.body = { name: 'Updated Work' };
      mockGroupService.updateGroup.mockResolvedValue(updatedGroupData);

      // Act
      await groupController.updateGroup(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.updateGroup).toHaveBeenCalledWith(
        mockGroupId,
        mockUserId,
        'Updated Work'
      );
      expect(mockRes.json).toHaveBeenCalledWith(updatedGroupData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle update group error', async () => {
      // Arrange
      const error = new Error('Update failed');
      mockReq.params = { id: mockGroupId };
      mockReq.body = { name: 'Updated Work' };
      mockGroupService.updateGroup.mockRejectedValue(error);

      // Act
      await groupController.updateGroup(mockReq, mockRes, mockNext);

      // Assert
      expect(mockGroupService.updateGroup).toHaveBeenCalledWith(
        mockGroupId,
        mockUserId,
        'Updated Work'
      );
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
