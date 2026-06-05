const { Op } = require('sequelize');
const { Token, User } = require('../../models/indexModel.js');
const TokenRepository = require('../../repositories/tokenRepository.js');

jest.mock('../../models/indexModel.js');

describe('TokenRepository', () => {
  let tokenRepository;
  const mockUserId = 42;
  const mockRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token';
  const mockExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const mockUserData = {
    id: mockUserId,
    login: 'testuser',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTokenData = {
    id: 1,
    refreshToken: mockRefreshToken,
    expiryDate: mockExpiryDate,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTokenWithUser = {
    ...mockTokenData,
    User: mockUserData,
  };

  beforeEach(() => {
    tokenRepository = new TokenRepository();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a new token successfully', async () => {
      // Arrange
      Token.create.mockResolvedValue(mockTokenData);

      // Act
      const result = await tokenRepository.create(mockRefreshToken, mockExpiryDate, mockUserId);

      // Assert
      expect(Token.create).toHaveBeenCalledTimes(1);
      expect(Token.create).toHaveBeenCalledWith({
        refreshToken: mockRefreshToken,
        expiryDate: mockExpiryDate,
        userId: mockUserId,
      });
      expect(result).toEqual(mockTokenData);
    });

    it('should create token with expiry date as string', async () => {
      // Arrange
      const expiryDateString = mockExpiryDate.toISOString();
      Token.create.mockResolvedValue({ ...mockTokenData, expiryDate: mockExpiryDate });

      // Act
      const result = await tokenRepository.create(mockRefreshToken, expiryDateString, mockUserId);

      // Assert
      expect(Token.create).toHaveBeenCalledWith({
        refreshToken: mockRefreshToken,
        expiryDate: expiryDateString,
        userId: mockUserId,
      });
      expect(result).toBeDefined();
    });

    it('should handle duplicate refresh token error', async () => {
      // Arrange
      const error = new Error('Duplicate entry');
      error.name = 'SequelizeUniqueConstraintError';
      Token.create.mockRejectedValue(error);

      // Act & Assert
      await expect(
        tokenRepository.create(mockRefreshToken, mockExpiryDate, mockUserId)
      ).rejects.toThrow();
      expect(Token.create).toHaveBeenCalledTimes(1);
    });

    it('should handle database error during creation', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      Token.create.mockRejectedValue(error);

      // Act & Assert
      await expect(
        tokenRepository.create(mockRefreshToken, mockExpiryDate, mockUserId)
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('delete', () => {
    it('should delete token successfully', async () => {
      // Arrange
      Token.destroy.mockResolvedValue(1);

      // Act
      const result = await tokenRepository.delete(mockRefreshToken);

      // Assert
      expect(Token.destroy).toHaveBeenCalledTimes(1);
      expect(Token.destroy).toHaveBeenCalledWith({
        where: { refreshToken: mockRefreshToken },
      });
      expect(result).toBe(true);
    });

    it('should return false when token not found', async () => {
      // Arrange
      Token.destroy.mockResolvedValue(0);

      // Act
      const result = await tokenRepository.delete('nonexistent.token');

      // Assert
      expect(Token.destroy).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('should handle delete errors', async () => {
      // Arrange
      const error = new Error('Delete failed');
      Token.destroy.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenRepository.delete(mockRefreshToken)).rejects.toThrow('Delete failed');
    });

    it('should handle null refreshToken', async () => {
      // Arrange
      Token.destroy.mockResolvedValue(0);

      // Act
      const result = await tokenRepository.delete(null);

      // Assert
      expect(Token.destroy).toHaveBeenCalledWith({
        where: { refreshToken: null },
      });
      expect(result).toBe(false);
    });
  });

  describe('findByTokenWithUser', () => {
    const validDate = new Date();
    const expiredDate = new Date(Date.now() - 1000); // Past date

    it('should find token with user successfully', async () => {
      // Arrange
      Token.findOne.mockResolvedValue(mockTokenWithUser);

      // Act
      const result = await tokenRepository.findByTokenWithUser(mockRefreshToken);

      // Assert
      expect(Token.findOne).toHaveBeenCalledTimes(1);
      expect(Token.findOne).toHaveBeenCalledWith({
        where: {
          refreshToken: mockRefreshToken,
          expiryDate: { [Op.gt]: expect.any(Date) },
        },
        include: [
          {
            model: User,
            attributes: ['id', 'login', 'role'],
          },
        ],
      });
      expect(result).toEqual(mockTokenWithUser);
      expect(result.User).toBeDefined();
      expect(result.User.id).toBe(mockUserId);
      expect(result.User.login).toBe('testuser');
      expect(result.User.role).toBe('user');
    });

    it('should return null when token is expired', async () => {
      // Arrange
      const expiredToken = { ...mockTokenWithUser, expiryDate: expiredDate };
      Token.findOne.mockResolvedValue(null);

      // Act
      const result = await tokenRepository.findByTokenWithUser(mockRefreshToken);

      // Assert
      expect(result).toBeNull();
      expect(Token.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            expiryDate: { [Op.gt]: expect.any(Date) },
          }),
        })
      );
    });

    it('should return null when token not found', async () => {
      // Arrange
      Token.findOne.mockResolvedValue(null);

      // Act
      const result = await tokenRepository.findByTokenWithUser('nonexistent.token');

      // Assert
      expect(Token.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should handle database error during find', async () => {
      // Arrange
      const error = new Error('Database query failed');
      Token.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenRepository.findByTokenWithUser(mockRefreshToken)).rejects.toThrow(
        'Database query failed'
      );
    });
  });

  describe('countByUserId', () => {
    it('should count tokens for user successfully', async () => {
      // Arrange
      const tokenCount = 3;
      Token.count.mockResolvedValue(tokenCount);

      // Act
      const result = await tokenRepository.countByUserId(mockUserId);

      // Assert
      expect(Token.count).toHaveBeenCalledTimes(1);
      expect(Token.count).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(result).toBe(tokenCount);
    });

    it('should return 0 when user has no tokens', async () => {
      // Arrange
      Token.count.mockResolvedValue(0);

      // Act
      const result = await tokenRepository.countByUserId(mockUserId);

      // Assert
      expect(result).toBe(0);
    });

    it('should handle count for non-existent user', async () => {
      // Arrange
      Token.count.mockResolvedValue(0);

      // Act
      const result = await tokenRepository.countByUserId(999);

      // Assert
      expect(result).toBe(0);
    });

    it('should handle database error during count', async () => {
      // Arrange
      const error = new Error('Count failed');
      Token.count.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenRepository.countByUserId(mockUserId)).rejects.toThrow('Count failed');
    });
  });

  describe('findOldestByUserId', () => {
    const oldestToken = {
      id: 1,
      refreshToken: 'oldest.token',
      expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      userId: mockUserId,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    };

    it('should find oldest token by userId successfully', async () => {
      // Arrange
      Token.findOne.mockResolvedValue(oldestToken);

      // Act
      const result = await tokenRepository.findOldestByUserId(mockUserId);

      // Assert
      expect(Token.findOne).toHaveBeenCalledTimes(1);
      expect(Token.findOne).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        order: [['createdAt', 'ASC']],
      });
      expect(result).toEqual(oldestToken);
      expect(result.createdAt).toBe(oldestToken.createdAt);
    });

    it('should return null when user has no tokens', async () => {
      // Arrange
      Token.findOne.mockResolvedValue(null);

      // Act
      const result = await tokenRepository.findOldestByUserId(999);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle database error during find oldest', async () => {
      // Arrange
      const error = new Error('Find failed');
      Token.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenRepository.findOldestByUserId(mockUserId)).rejects.toThrow('Find failed');
    });
  });
});
