// tests/service/groupService.test.js
const GroupService = require('../../service/groupService.js');
const ApiError = require('../../exceptions/apiError.js');

// mock the GroupRepository to isolate GroupService tests from database interactions
jest.mock('../../repositories/groupRepository.js');

const GroupRepository = require('../../repositories/groupRepository.js');

describe('GroupService', () => {
  let groupService;
  let mockGroupRepository;

  const mockUserId = 1;
  const mockGroupId = 1;
  const mockGroupName = 'Work';

  const mockGroupData = {
    id: mockGroupId,
    name: mockGroupName,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // create a new instance of the mocked GroupRepository for each test
    mockGroupRepository = new GroupRepository();

    // create the GroupService instance with the mocked repository
    groupService = new GroupService(mockGroupRepository);
  });

  describe('createGroup', () => {
    it('should create a group successfully', async () => {
      // Arrange
      mockGroupRepository.create.mockResolvedValue(mockGroupData);

      // Act
      const result = await groupService.createGroup(mockGroupName, mockUserId);

      // Assert
      expect(mockGroupRepository.create).toHaveBeenCalledWith(mockGroupName, mockUserId);
      expect(result).toEqual(mockGroupData);
    });

    it('should handle repository error during creation', async () => {
      // Arrange
      const error = new Error('Database error');
      mockGroupRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(groupService.createGroup(mockGroupName, mockUserId)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('updateGroup', () => {
    const newName = 'Updated Group Name';

    it('should update a group successfully', async () => {
      // Arrange
      const updatedGroup = { ...mockGroupData, name: newName };
      mockGroupRepository.update.mockResolvedValue(updatedGroup);

      // Act
      const result = await groupService.updateGroup(mockGroupId, mockUserId, newName);

      // Assert
      expect(mockGroupRepository.update).toHaveBeenCalledWith(mockGroupId, mockUserId, newName);
      expect(result).toEqual(updatedGroup);
      expect(result.name).toBe(newName);
    });

    it('should throw NotFound error when group to update does not exist', async () => {
      // Arrange
      mockGroupRepository.update.mockResolvedValue(null);

      // Act & Assert
      await expect(groupService.updateGroup(mockGroupId, mockUserId, newName)).rejects.toThrow(
        ApiError
      );
      await expect(groupService.updateGroup(mockGroupId, mockUserId, newName)).rejects.toThrow(
        'Not Found'
      );
    });

    it('should handle repository error during update', async () => {
      // Arrange
      const error = new Error('Database error');
      mockGroupRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(groupService.updateGroup(mockGroupId, mockUserId, newName)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group successfully', async () => {
      // Arrange
      mockGroupRepository.delete.mockResolvedValue(true);

      // Act
      const result = await groupService.deleteGroup(mockGroupId, mockUserId);

      // Assert
      expect(mockGroupRepository.delete).toHaveBeenCalledWith(mockGroupId, mockUserId);
      expect(result).toBe(true);
    });

    it('should throw NotFound error when group to delete does not exist', async () => {
      // Arrange
      mockGroupRepository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(groupService.deleteGroup(mockGroupId, mockUserId)).rejects.toThrow(ApiError);
      await expect(groupService.deleteGroup(mockGroupId, mockUserId)).rejects.toThrow('Not Found');
    });

    it('should handle repository error during delete', async () => {
      // Arrange
      const error = new Error('Database error');
      mockGroupRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(groupService.deleteGroup(mockGroupId, mockUserId)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getGroupById', () => {
    it('should get group by id successfully', async () => {
      // Arrange
      mockGroupRepository.findById.mockResolvedValue(mockGroupData);

      // Act
      const result = await groupService.getGroupById(mockGroupId, mockUserId);

      // Assert
      expect(mockGroupRepository.findById).toHaveBeenCalledWith(mockGroupId, mockUserId);
      expect(result).toEqual(mockGroupData);
    });

    it('should throw NotFound error when group not found', async () => {
      // Arrange
      mockGroupRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(groupService.getGroupById(mockGroupId, mockUserId)).rejects.toThrow(ApiError);
      await expect(groupService.getGroupById(mockGroupId, mockUserId)).rejects.toThrow('Not Found');
    });

    it('should handle repository error during find', async () => {
      // Arrange
      const error = new Error('Database error');
      mockGroupRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(groupService.getGroupById(mockGroupId, mockUserId)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('findGroupsByOptions', () => {
    const mockOptions = {
      limit: 10,
      page: 1,
      userId: mockUserId,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      offset: 0,
    };

    const mockGroupsResult = {
      count: 2,
      rows: [mockGroupData, { ...mockGroupData, id: 2, name: 'Personal' }],
    };

    it('should find groups with pagination successfully', async () => {
      // Arrange
      mockGroupRepository.findAndCount.mockResolvedValue(mockGroupsResult);

      // Act
      const result = await groupService.findGroupsByOptions(mockOptions);

      // Assert
      expect(mockGroupRepository.findAndCount).toHaveBeenCalledWith({
        whereClause: { userId: mockUserId },
        limit: mockOptions.limit,
        offset: mockOptions.offset,
        sortBy: mockOptions.sortBy,
        sortOrder: mockOptions.sortOrder,
      });
      expect(result).toEqual({
        ...mockGroupsResult,
        limit: mockOptions.limit,
        currentPage: mockOptions.page,
      });
      expect(result.count).toBe(2);
      expect(result.rows).toHaveLength(2);
      expect(result.limit).toBe(10);
      expect(result.currentPage).toBe(1);
    });

    it('should handle different pagination parameters', async () => {
      // Arrange
      const customOptions = {
        limit: 20,
        page: 3,
        userId: mockUserId,
        sortBy: 'name',
        sortOrder: 'ASC',
        offset: 40,
      };
      mockGroupRepository.findAndCount.mockResolvedValue(mockGroupsResult);

      // Act
      const result = await groupService.findGroupsByOptions(customOptions);

      // Assert
      expect(mockGroupRepository.findAndCount).toHaveBeenCalledWith({
        whereClause: { userId: mockUserId },
        limit: 20,
        offset: 40,
        sortBy: 'name',
        sortOrder: 'ASC',
      });
      expect(result.limit).toBe(20);
      expect(result.currentPage).toBe(3);
    });

    it('should handle empty result', async () => {
      // Arrange
      const emptyResult = { count: 0, rows: [] };
      mockGroupRepository.findAndCount.mockResolvedValue(emptyResult);

      // Act
      const result = await groupService.findGroupsByOptions(mockOptions);

      // Assert
      expect(result.count).toBe(0);
      expect(result.rows).toHaveLength(0);
      expect(result.limit).toBe(10);
      expect(result.currentPage).toBe(1);
    });

    it('should handle repository error during find', async () => {
      // Arrange
      const error = new Error('Database error');
      mockGroupRepository.findAndCount.mockRejectedValue(error);

      // Act & Assert
      await expect(groupService.findGroupsByOptions(mockOptions)).rejects.toThrow('Database error');
    });
  });
});
