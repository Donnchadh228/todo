// tests/service/tokenService.test.js
const jwt = require('jsonwebtoken');
const TokenService = require('../../service/tokenService.js');
const ApiError = require('../../exceptions/apiError.js');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../repositories/tokenRepository.js');

const TokenRepository = require('../../repositories/tokenRepository.js');

describe('TokenService', () => {
  let tokenService;
  let mockTokenRepository;

  const mockUserId = 1;
  const mockRefreshToken = 'mock.refresh.token';
  const mockAccessToken = 'mock.access.token';
  const mockPayload = {
    id: mockUserId,
    login: 'testuser',
    role: 'user',
  };

  const mockDecodedToken = {
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    id: mockUserId,
    login: 'testuser',
  };

  const mockExpiryDate = new Date(mockDecodedToken.exp * 1000);

  const mockTokenRecord = {
    id: 1,
    refreshToken: mockRefreshToken,
    expiryDate: mockExpiryDate,
    userId: mockUserId,
    user: {
      id: mockUserId,
      login: 'testuser',
      role: 'user',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup environment variables
    process.env.SECRETKEY = 'test_secret_key';
    process.env.SECRETKEY_REFRESH = 'test_refresh_secret_key';
    process.env.ACCESS_TOKEN_TIME = '15m';
    process.env.REFRESH_TOKEN_TIME = '7d';

    // Create fresh mock repository
    mockTokenRepository = new TokenRepository();

    // Create service with mock
    tokenService = new TokenService(mockTokenRepository);
  });

  describe('generateToken', () => {
    it('should generate access and refresh tokens successfully', () => {
      // Arrange
      const mockAccessToken = 'generated.access.token';
      const mockRefreshToken = 'generated.refresh.token';

      jwt.sign.mockReturnValueOnce(mockAccessToken).mockReturnValueOnce(mockRefreshToken);

      // Act
      const result = tokenService.generateToken(mockPayload);

      // Assert
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(jwt.sign).toHaveBeenNthCalledWith(1, mockPayload, process.env.SECRETKEY, {
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      });
      expect(jwt.sign).toHaveBeenNthCalledWith(2, mockPayload, process.env.SECRETKEY_REFRESH, {
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      });
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });

  describe('validateAccessToken', () => {
    it('should validate access token successfully', () => {
      // Arrange
      jwt.verify.mockReturnValue(mockPayload);

      // Act
      const result = tokenService.validateAccessToken(mockAccessToken);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(mockAccessToken, process.env.SECRETKEY);
      expect(result).toEqual(mockPayload);
    });

    it('should return null when access token is invalid', () => {
      // Arrange
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = tokenService.validateAccessToken('invalid.token');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when access token is expired', () => {
      // Arrange
      jwt.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      // Act
      const result = tokenService.validateAccessToken('expired.token');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate refresh token successfully', () => {
      // Arrange
      jwt.verify.mockReturnValue(mockPayload);

      // Act
      const result = tokenService.validateRefreshToken(mockRefreshToken);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, process.env.SECRETKEY_REFRESH);
      expect(result).toEqual(mockPayload);
    });

    it('should return null when refresh token is invalid', () => {
      // Arrange
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = tokenService.validateRefreshToken('invalid.token');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('saveToken', () => {
    it('should save token successfully', async () => {
      // Arrange
      jwt.decode.mockReturnValue(mockDecodedToken);
      mockTokenRepository.create.mockResolvedValue(mockTokenRecord);

      // Act
      const result = await tokenService.saveToken(mockUserId, mockRefreshToken);

      // Assert
      expect(jwt.decode).toHaveBeenCalledWith(mockRefreshToken);
      expect(mockTokenRepository.create).toHaveBeenCalledWith(
        mockRefreshToken,
        expect.any(Date),
        mockUserId
      );
      expect(result).toEqual(mockTokenRecord);
    });

    it('should handle repository error during save', async () => {
      // Arrange
      jwt.decode.mockReturnValue(mockDecodedToken);
      const error = new Error('Database error');
      mockTokenRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenService.saveToken(mockUserId, mockRefreshToken)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('deleteToken', () => {
    it('should delete token successfully', async () => {
      // Arrange
      mockTokenRepository.delete.mockResolvedValue(true);

      // Act
      const result = await tokenService.deleteToken(mockRefreshToken);

      // Assert
      expect(mockTokenRepository.delete).toHaveBeenCalledWith(mockRefreshToken);
      expect(result).toBe(true);
    });

    it('should return false when token not found', async () => {
      // Arrange
      mockTokenRepository.delete.mockResolvedValue(false);

      // Act
      const result = await tokenService.deleteToken('nonexistent.token');

      // Assert
      expect(result).toBe(false);
    });

    it('should handle repository error during delete', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTokenRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenService.deleteToken(mockRefreshToken)).rejects.toThrow('Database error');
    });
  });

  describe('refresh', () => {
    const newAccessToken = 'new.access.token';
    const newRefreshToken = 'new.refresh.token';

    it('should refresh tokens successfully', async () => {
      // Arrange
      mockTokenRepository.findByTokenWithUser.mockResolvedValue(mockTokenRecord);
      mockTokenRepository.delete.mockResolvedValue(true);
      jwt.sign.mockReturnValueOnce(newAccessToken).mockReturnValueOnce(newRefreshToken);
      jwt.decode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 86400 });
      mockTokenRepository.create.mockResolvedValue({
        ...mockTokenRecord,
        refreshToken: newRefreshToken,
      });

      // Act
      const result = await tokenService.refresh(mockRefreshToken);

      // Assert
      expect(mockTokenRepository.findByTokenWithUser).toHaveBeenCalledWith(mockRefreshToken);
      expect(mockTokenRepository.delete).toHaveBeenCalledWith(mockRefreshToken);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockTokenRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });

    it('should throw Unauthorized error when token record not found', async () => {
      // Arrange
      mockTokenRepository.findByTokenWithUser.mockResolvedValue(null);

      // Act & Assert
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow(ApiError);
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow('Unauthorized');
      expect(mockTokenRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw Unauthorized error when token has no user', async () => {
      // Arrange
      const tokenWithoutUser = { ...mockTokenRecord, user: null };
      mockTokenRepository.findByTokenWithUser.mockResolvedValue(tokenWithoutUser);

      // Act & Assert
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow(ApiError);
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow('Unauthorized');
      expect(mockTokenRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequest when failed to delete old token', async () => {
      // Arrange
      mockTokenRepository.findByTokenWithUser.mockResolvedValue(mockTokenRecord);
      mockTokenRepository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow(ApiError);
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow(
        'Failed to delete old refresh token'
      );
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw BadRequest when failed to save new token', async () => {
      // Arrange
      mockTokenRepository.findByTokenWithUser.mockResolvedValue(mockTokenRecord);
      mockTokenRepository.delete.mockResolvedValue(true);
      jwt.sign.mockReturnValueOnce(newAccessToken).mockReturnValueOnce(newRefreshToken);
      jwt.decode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 86400 });
      mockTokenRepository.create.mockResolvedValue(null);

      // Act & Assert
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow(ApiError);
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow(
        'Failed to save new refresh token'
      );
    });

    it('should handle repository error during find', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTokenRepository.findByTokenWithUser.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenService.refresh(mockRefreshToken)).rejects.toThrow('Database error');
    });
  });

  describe('enforceSessionLimit', () => {
    it('should not delete any session when count is below limit', async () => {
      // Arrange
      mockTokenRepository.countByUserId.mockResolvedValue(2);

      // Act
      await tokenService.enforceSessionLimit(mockUserId);

      // Assert
      expect(mockTokenRepository.countByUserId).toHaveBeenCalledWith(mockUserId);
      expect(mockTokenRepository.findOldestByUserId).not.toHaveBeenCalled();
      expect(mockTokenRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete oldest session when count equals limit', async () => {
      // Arrange
      const oldestSession = { refreshToken: 'oldest.token' };
      mockTokenRepository.countByUserId.mockResolvedValue(3);
      mockTokenRepository.findOldestByUserId.mockResolvedValue(oldestSession);
      mockTokenRepository.delete.mockResolvedValue(true);

      // Act
      await tokenService.enforceSessionLimit(mockUserId);

      // Assert
      expect(mockTokenRepository.countByUserId).toHaveBeenCalledWith(mockUserId);
      expect(mockTokenRepository.findOldestByUserId).toHaveBeenCalledWith(mockUserId);
      expect(mockTokenRepository.delete).toHaveBeenCalledWith(oldestSession.refreshToken);
    });

    it('should delete oldest session when count exceeds limit', async () => {
      // Arrange
      const oldestSession = { refreshToken: 'oldest.token' };
      mockTokenRepository.countByUserId.mockResolvedValue(5);
      mockTokenRepository.findOldestByUserId.mockResolvedValue(oldestSession);
      mockTokenRepository.delete.mockResolvedValue(true);

      // Act
      await tokenService.enforceSessionLimit(mockUserId);

      // Assert
      expect(mockTokenRepository.delete).toHaveBeenCalledWith(oldestSession.refreshToken);
    });

    it('should handle repository error during count', async () => {
      // Arrange
      const error = new Error('Database error');
      mockTokenRepository.countByUserId.mockRejectedValue(error);

      // Act & Assert
      await expect(tokenService.enforceSessionLimit(mockUserId)).rejects.toThrow('Database error');
    });
  });
});
