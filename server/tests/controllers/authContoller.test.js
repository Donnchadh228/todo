// tests/controllers/authController.test.js
const AuthController = require('../../controllers/authController.js');
const ApiError = require('../../exceptions/apiError.js');
const setCookie = require('../../utils/setRefreshTokenCookie.js');

// Mock dependencies
jest.mock('auto-bind', () => ({
  default: (self) => self,
}));
jest.mock('../../service/authService.js');
jest.mock('../../service/tokenService.js');
jest.mock('../../service/userService.js');
jest.mock('../../utils/setRefreshTokenCookie.js');

const AuthService = require('../../service/authService.js');
const TokenService = require('../../service/tokenService.js');
const UserService = require('../../service/userService.js');

describe('AuthController', () => {
  let authController;
  let mockAuthService;
  let mockTokenService;
  let mockUserService;

  let mockReq;
  let mockRes;
  let mockNext;

  const mockLogin = 'testuser';
  const mockPassword = 'password123';
  const mockRefreshToken = 'mock.refresh.token';
  const mockAccessToken = 'mock.access.token';
  const mockNewRefreshToken = 'new.refresh.token';

  const mockUserData = {
    id: 1,
    login: mockLogin,
    role: 'user',
  };

  const mockAuthResult = {
    user: mockUserData,
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh mocks
    mockAuthService = new AuthService();
    mockTokenService = new TokenService();
    mockUserService = new UserService();

    // Create controller with mocks
    authController = new AuthController(mockAuthService, mockTokenService, mockUserService);

    // Setup request, response, next function mocks
    mockReq = {
      body: {},
      cookies: {},
      user: null,
    };

    mockRes = {
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    mockNext = jest.fn();
  });

  describe('registration', () => {
    it('should register user successfully and return user data without refresh token', async () => {
      // Arrange
      mockReq.body = { login: mockLogin, password: mockPassword };
      mockAuthService.registration.mockResolvedValue(mockAuthResult);

      // Act
      await authController.registration(mockReq, mockRes, mockNext);

      // Assert
      expect(mockAuthService.registration).toHaveBeenCalledWith(mockLogin, mockPassword);
      expect(setCookie).toHaveBeenCalledWith(mockRes, mockRefreshToken);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: mockUserData,
        accessToken: mockAccessToken,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle registration error and pass to next', async () => {
      // Arrange
      const error = new Error('Registration failed');
      mockReq.body = { login: mockLogin, password: mockPassword };
      mockAuthService.registration.mockRejectedValue(error);

      // Act
      await authController.registration(mockReq, mockRes, mockNext);

      // Assert
      expect(mockAuthService.registration).toHaveBeenCalledWith(mockLogin, mockPassword);
      expect(setCookie).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('should login user successfully and return user data without refresh token', async () => {
      // Arrange
      mockReq.body = { login: mockLogin, password: mockPassword };
      mockAuthService.login.mockResolvedValue(mockAuthResult);

      // Act
      await authController.login(mockReq, mockRes, mockNext);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLogin, mockPassword);
      expect(setCookie).toHaveBeenCalledWith(mockRes, mockRefreshToken);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: mockUserData,
        accessToken: mockAccessToken,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle login error and pass to next', async () => {
      // Arrange
      const error = new Error('Login failed');
      mockReq.body = { login: mockLogin, password: mockPassword };
      mockAuthService.login.mockRejectedValue(error);

      // Act
      await authController.login(mockReq, mockRes, mockNext);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLogin, mockPassword);
      expect(setCookie).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should logout user successfully when refresh token exists', async () => {
      // Arrange
      mockReq.cookies = { refreshToken: mockRefreshToken };
      mockAuthService.logout.mockResolvedValue(true);

      // Act
      await authController.logout(mockReq, mockRes, mockNext);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(mockRefreshToken);
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(mockRes.json).toHaveBeenCalledWith(true);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return empty json when no refresh token in cookies', async () => {
      // Arrange
      mockReq.cookies = {};

      // Act
      await authController.logout(mockReq, mockRes, mockNext);

      // Assert
      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(mockRes.clearCookie).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle logout error and pass to next', async () => {
      // Arrange
      const error = new Error('Logout failed');
      mockReq.cookies = { refreshToken: mockRefreshToken };
      mockAuthService.logout.mockRejectedValue(error);

      // Act
      await authController.logout(mockReq, mockRes, mockNext);

      // Assert
      expect(mockAuthService.logout).toHaveBeenCalledWith(mockRefreshToken);
      expect(mockRes.clearCookie).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully and return new access token', async () => {
      // Arrange
      mockReq.cookies = { refreshToken: mockRefreshToken };
      mockTokenService.refresh.mockResolvedValue({
        accessToken: mockAccessToken,
        refreshToken: mockNewRefreshToken,
      });

      // Act
      await authController.refreshToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTokenService.refresh).toHaveBeenCalledWith(mockRefreshToken);
      expect(setCookie).toHaveBeenCalledWith(mockRes, mockNewRefreshToken);
      expect(mockRes.json).toHaveBeenCalledWith(mockAccessToken);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw Unauthorized error when no refresh token', async () => {
      // Arrange
      mockReq.cookies = {};

      // Act
      await authController.refreshToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTokenService.refresh).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      expect(mockNext.mock.calls[0][0].message).toBe('Unauthorized');
      expect(setCookie).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should handle refresh token error and pass to next', async () => {
      // Arrange
      const error = new Error('Refresh failed');
      mockReq.cookies = { refreshToken: mockRefreshToken };
      mockTokenService.refresh.mockRejectedValue(error);

      // Act
      await authController.refreshToken(mockReq, mockRes, mockNext);

      // Assert
      expect(mockTokenService.refresh).toHaveBeenCalledWith(mockRefreshToken);
      expect(setCookie).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('check', () => {
    it('should return user data when user is authenticated', async () => {
      // Arrange
      mockReq.user = mockUserData;
      mockUserService.getUserDto.mockReturnValue(mockUserData);

      // Act
      await authController.check(mockReq, mockRes, mockNext);

      // Assert
      expect(mockUserService.getUserDto).toHaveBeenCalledWith(mockUserData);
      expect(mockRes.json).toHaveBeenCalledWith(mockUserData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle check error and pass to next', async () => {
      // Arrange
      const error = new Error('Check failed');
      mockReq.user = mockUserData;
      mockUserService.getUserDto.mockImplementation(() => {
        throw error;
      });

      // Act
      await authController.check(mockReq, mockRes, mockNext);

      // Assert
      expect(mockUserService.getUserDto).toHaveBeenCalledWith(mockUserData);
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
