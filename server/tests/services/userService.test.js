// tests/service/userService.test.js
const bcrypt = require('bcrypt');
const UserService = require('../../service/userService.js');
const UserDto = require('../../dtos/userDto.js');
const ApiError = require('../../exceptions/apiError.js');

// Mock dependencies
jest.mock('bcrypt');
jest.mock('../../repositories/userRepository.js');
jest.mock('../../dtos/userDto.js');

const UserRepository = require('../../repositories/userRepository.js');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  const mockLogin = 'testuser';
  const mockPassword = 'password123';
  const mockHashedPassword = 'hashed_password_123';
  const mockUserId = 1;
  const mockUserRole = 'user';

  const mockUserData = {
    id: mockUserId,
    login: mockLogin,
    password: mockHashedPassword,
    role: mockUserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserDto = {
    id: mockUserId,
    login: mockLogin,
    role: mockUserRole,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create fresh mock repository
    mockUserRepository = new UserRepository();

    // Create service with mock
    userService = new UserService(mockUserRepository);
  });

  describe('getUserDto', () => {
    it('should return user DTO successfully', () => {
      // Arrange
      UserDto.mockImplementation((user) => ({
        id: user.id,
        login: user.login,
        role: user.role,
      }));

      // Act
      const result = userService.getUserDto(mockUserData);

      // Assert
      expect(UserDto).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual(mockUserDto);
    });
  });

  describe('findUserByLogin', () => {
    it('should find user by login successfully', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(mockUserData);

      // Act
      const result = await userService.findUserByLogin(mockLogin);

      // Assert
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(mockLogin);
      expect(result).toEqual(mockUserData);
    });

    it('should return null when user not found', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(null);

      // Act
      const result = await userService.findUserByLogin('nonexistent');

      // Assert
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });

    it('should handle repository error during find', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.findByLogin.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.findUserByLogin(mockLogin)).rejects.toThrow('Database error');
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      mockUserRepository.createUser.mockResolvedValue(mockUserData);

      // Act
      const result = await userService.createUser(mockLogin, mockPassword);

      // Assert
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(mockLogin);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 7);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(mockLogin, mockHashedPassword);
      expect(result).toEqual(mockUserData);
    });

    it('should throw error when user with login already exists', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(mockUserData);

      // Act & Assert
      await expect(userService.createUser(mockLogin, mockPassword)).rejects.toThrow(ApiError);
      await expect(userService.createUser(mockLogin, mockPassword)).rejects.toThrow(
        'User with this login already exists'
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should handle bcrypt error during password hashing', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(null);
      const error = new Error('Bcrypt error');
      bcrypt.hash.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.createUser(mockLogin, mockPassword)).rejects.toThrow('Bcrypt error');
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should handle repository error during user creation', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(mockHashedPassword);
      const error = new Error('Database error');
      mockUserRepository.createUser.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.createUser(mockLogin, mockPassword)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle repository error during duplicate check', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.findByLogin.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.createUser(mockLogin, mockPassword)).rejects.toThrow(
        'Database error'
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });
  });
});
