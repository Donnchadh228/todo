const AuthService = require('../../service/authService.js');
const ApiError = require('../../exceptions/apiError.js');
const bcrypt = require('bcrypt');

jest.mock('../../service/userService.js');
jest.mock('../../service/tokenService.js');
jest.mock('bcrypt');

const UserService = require('../../service/userService.js');
const TokenService = require('../../service/tokenService.js');

describe('AuthService', () => {
  let authService;
  let mockUserService;
  let mockTokenService;

  const mockUserData = {
    id: 1,
    login: 'testuser',
    password: 'hashedPassword123',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserDto = {
    id: 1,
    login: 'testuser',
    role: 'user',
  };

  const mockTokens = {
    accessToken: 'mock.access.token',
    refreshToken: 'mock.refresh.token',
  };

  const mockAuthResponse = {
    user: mockUserDto,
    accessToken: mockTokens.accessToken,
    refreshToken: mockTokens.refreshToken,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh mocks for each test
    mockUserService = new UserService();
    mockTokenService = new TokenService();

    // Create the AuthService instance with mocked dependencies
    authService = new AuthService(mockUserService, mockTokenService);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('registration', () => {
    const login = 'newuser';
    const password = 'password123';

    it('should register user successfully', async () => {
      // Arrange
      mockUserService.createUser.mockResolvedValue(mockUserData);
      mockUserService.getUserDto.mockReturnValue(mockUserDto);
      mockTokenService.generateToken.mockReturnValue(mockTokens);
      mockTokenService.saveToken.mockResolvedValue(true);

      // Act
      const result = await authService.registration(login, password);

      // Assert
      expect(mockUserService.createUser).toHaveBeenCalledWith(login, password);
      expect(mockUserService.getUserDto).toHaveBeenCalledWith(mockUserData);
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(mockUserDto);
      expect(mockTokenService.saveToken).toHaveBeenCalledWith(
        mockUserDto.id,
        mockTokens.refreshToken
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle user creation failure', async () => {
      // Arrange
      const error = new Error('User already exists');
      mockUserService.createUser.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.registration(login, password)).rejects.toThrow(
        'User already exists'
      );
      expect(mockTokenService.saveToken).not.toHaveBeenCalled();
    });

    it('should handle token generation failure', async () => {
      // Arrange
      mockUserService.createUser.mockResolvedValue(mockUserData);
      mockUserService.getUserDto.mockReturnValue(mockUserDto);
      mockTokenService.generateToken.mockImplementation(() => {
        throw new Error('Token generation failed');
      });

      // Act & Assert
      await expect(authService.registration(login, password)).rejects.toThrow(
        'Token generation failed'
      );
      expect(mockTokenService.saveToken).not.toHaveBeenCalled();
    });

    it('should handle save token failure', async () => {
      // Arrange
      mockUserService.createUser.mockResolvedValue(mockUserData);
      mockUserService.getUserDto.mockReturnValue(mockUserDto);
      mockTokenService.generateToken.mockReturnValue(mockTokens);
      mockTokenService.saveToken.mockRejectedValue(new Error('Failed to save token'));

      // Act & Assert
      await expect(authService.registration(login, password)).rejects.toThrow(
        'Failed to save token'
      );
    });
  });

  describe('login', () => {
    const login = 'testuser';
    const password = 'password123';

    it('should login user successfully', async () => {
      // Arrange
      mockUserService.findUserByLogin.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(true);
      mockUserService.getUserDto.mockReturnValue(mockUserDto);
      mockTokenService.generateToken.mockReturnValue(mockTokens);
      mockTokenService.enforceSessionLimit.mockResolvedValue(true);
      mockTokenService.saveToken.mockResolvedValue(true);

      // Act
      const result = await authService.login(login, password);

      // Assert
      expect(mockUserService.findUserByLogin).toHaveBeenCalledWith(login);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUserData.password);
      expect(mockUserService.getUserDto).toHaveBeenCalledWith(mockUserData);
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(mockUserDto);
      expect(mockTokenService.enforceSessionLimit).toHaveBeenCalledWith(mockUserDto.id);
      expect(mockTokenService.saveToken).toHaveBeenCalledWith(
        mockUserDto.id,
        mockTokens.refreshToken
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      mockUserService.findUserByLogin.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(login, password)).rejects.toThrow(ApiError);
      await expect(authService.login(login, password)).rejects.toThrow('Login incorrect');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockTokenService.saveToken).not.toHaveBeenCalled();
    });

    it('should throw error when password is incorrect', async () => {
      // Arrange
      mockUserService.findUserByLogin.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(login, password)).rejects.toThrow(ApiError);
      await expect(authService.login(login, password)).rejects.toThrow('Password incorrect');
      expect(mockTokenService.saveToken).not.toHaveBeenCalled();
    });

    it('should handle enforceSessionLimit failure', async () => {
      // Arrange
      mockUserService.findUserByLogin.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(true);
      mockUserService.getUserDto.mockReturnValue(mockUserDto);
      mockTokenService.generateToken.mockReturnValue(mockTokens);
      mockTokenService.enforceSessionLimit.mockRejectedValue(new Error('Session limit exceeded'));

      // Act & Assert
      await expect(authService.login(login, password)).rejects.toThrow('Session limit exceeded');
      expect(mockTokenService.saveToken).not.toHaveBeenCalled();
    });

    it('should handle saveToken failure', async () => {
      // Arrange
      mockUserService.findUserByLogin.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(true);
      mockUserService.getUserDto.mockReturnValue(mockUserDto);
      mockTokenService.generateToken.mockReturnValue(mockTokens);
      mockTokenService.enforceSessionLimit.mockResolvedValue(true);
      mockTokenService.saveToken.mockRejectedValue(new Error('Failed to save token'));

      // Act & Assert
      await expect(authService.login(login, password)).rejects.toThrow('Failed to save token');
    });

    it('should handle database error during user lookup', async () => {
      // Arrange
      mockUserService.findUserByLogin.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(authService.login(login, password)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('logout', () => {
    const refreshToken = 'valid.refresh.token';

    it('should logout user successfully', async () => {
      // Arrange
      mockTokenService.deleteToken.mockResolvedValue(true);

      // Act
      const result = await authService.logout(refreshToken);

      // Assert
      expect(mockTokenService.deleteToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toBe(true);
    });

    it('should return false when token not found', async () => {
      // Arrange
      mockTokenService.deleteToken.mockResolvedValue(false);

      // Act
      const result = await authService.logout(refreshToken);

      // Assert
      expect(result).toBe(false);
    });

    it('should handle delete token failure', async () => {
      // Arrange
      mockTokenService.deleteToken.mockRejectedValue(new Error('Delete failed'));

      // Act & Assert
      await expect(authService.logout(refreshToken)).rejects.toThrow('Delete failed');
    });

    it('should handle null refresh token', async () => {
      // Arrange
      mockTokenService.deleteToken.mockResolvedValue(false);

      // Act
      const result = await authService.logout(null);

      // Assert
      expect(mockTokenService.deleteToken).toHaveBeenCalledWith(null);
      expect(result).toBe(false);
    });
  });

  describe('_generateAuthResponse (private method testing)', () => {
    it('should generate correct auth response', () => {
      const userData = { id: 1, name: 'test' };
      const generatedJWT = { accessToken: 'access', refreshToken: 'refresh' };

      const result = authService._generateAuthResponse(userData, generatedJWT);

      expect(result).toEqual({
        user: userData,
        ...generatedJWT,
      });
    });
  });

  describe('_issueTokensForUser (private method testing)', () => {
    it('should issue tokens correctly', () => {
      const mockUser = { id: 1, login: 'test', role: 'user' };
      const mockDto = { id: 1, login: 'test', role: 'user' };
      const mockGeneratedTokens = { accessToken: 'access', refreshToken: 'refresh' };

      mockUserService.getUserDto.mockReturnValue(mockDto);
      mockTokenService.generateToken.mockReturnValue(mockGeneratedTokens);

      const result = authService._issueTokensForUser(mockUser);

      expect(mockUserService.getUserDto).toHaveBeenCalledWith(mockUser);
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual({
        user: mockDto,
        ...mockGeneratedTokens,
      });
    });
  });
});
