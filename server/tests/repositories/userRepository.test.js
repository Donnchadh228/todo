const { User } = require('../../models/indexModel.js');
const UserRepository = require('../../repositories/userRepository.js');

jest.mock('../../models/indexModel.js');

describe('UserRepository', () => {
  let userRepository;
  const mockLogin = 'testuser';
  const mockPassword = 'hashedPassword123';
  const mockUserId = 42;
  const mockUserRole = 'user';

  const mockUserData = {
    id: mockUserId,
    login: mockLogin,
    password: mockPassword,
    role: mockUserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('findByLogin', () => {
    it('should find user by login successfully', async () => {
      // Arrange
      User.findOne.mockResolvedValue(mockUserData);

      // Act
      const result = await userRepository.findByLogin(mockLogin);

      // Assert
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(User.findOne).toHaveBeenCalledWith({
        where: { login: mockLogin },
      });
      expect(result).toEqual(mockUserData);
      expect(result.login).toBe(mockLogin);
      expect(result.id).toBe(mockUserId);
    });

    it('should return null when user not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      const result = await userRepository.findByLogin('nonexistent');

      // Assert
      expect(User.findOne).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should handle case-sensitive login search', async () => {
      // Arrange
      const upperCaseLogin = 'TESTUSER';
      User.findOne.mockResolvedValue(null);

      // Act
      const result = await userRepository.findByLogin(upperCaseLogin);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { login: upperCaseLogin },
      });
      expect(result).toBeNull();
    });

    it('should handle login with special characters', async () => {
      // Arrange
      const specialLogin = 'user@#$%^&*()';
      const mockSpecialUser = { ...mockUserData, login: specialLogin };
      User.findOne.mockResolvedValue(mockSpecialUser);

      // Act
      const result = await userRepository.findByLogin(specialLogin);

      // Assert
      expect(result).toEqual(mockSpecialUser);
      expect(result.login).toBe(specialLogin);
    });

    it('should handle login with spaces', async () => {
      // Arrange
      const loginWithSpaces = 'test user 123';
      const mockSpacedUser = { ...mockUserData, login: loginWithSpaces };
      User.findOne.mockResolvedValue(mockSpacedUser);

      // Act
      const result = await userRepository.findByLogin(loginWithSpaces);

      // Assert
      expect(result).toEqual(mockSpacedUser);
      expect(result.login).toBe(loginWithSpaces);
    });

    it('should handle empty login string', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      const result = await userRepository.findByLogin('');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { login: '' },
      });
      expect(result).toBeNull();
    });

    it('should handle null login', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      const result = await userRepository.findByLogin(null);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { login: null },
      });
      expect(result).toBeNull();
    });

    it('should handle database error during find', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      User.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.findByLogin(mockLogin)).rejects.toThrow(
        'Database connection failed'
      );
      expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle very long login string', async () => {
      // Arrange
      const longLogin = 'a'.repeat(255);
      const mockLongLoginUser = { ...mockUserData, login: longLogin };
      User.findOne.mockResolvedValue(mockLongLoginUser);

      // Act
      const result = await userRepository.findByLogin(longLogin);

      // Assert
      expect(result.login).toBe(longLogin);
      expect(result.login.length).toBe(255);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Arrange
      User.create.mockResolvedValue(mockUserData);

      // Act
      const result = await userRepository.createUser(mockLogin, mockPassword);

      // Assert
      expect(User.create).toHaveBeenCalledTimes(1);
      expect(User.create).toHaveBeenCalledWith({
        login: mockLogin,
        password: mockPassword,
      });
      expect(result).toEqual(mockUserData);
      expect(result.login).toBe(mockLogin);
      expect(result.password).toBe(mockPassword);
    });

    it('should create user with default role', async () => {
      // Arrange
      const userWithDefaultRole = { ...mockUserData, role: 'user' };
      User.create.mockResolvedValue(userWithDefaultRole);

      // Act
      const result = await userRepository.createUser(mockLogin, mockPassword);

      // Assert
      expect(result.role).toBe('user');
      expect(result.role).toBeDefined();
    });

    it('should handle duplicate login error', async () => {
      // Arrange
      const error = new Error('Duplicate entry');
      error.name = 'SequelizeUniqueConstraintError';
      User.create.mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.createUser(mockLogin, mockPassword)).rejects.toThrow();
      expect(User.create).toHaveBeenCalledTimes(1);
    });

    it('should handle database error during creation', async () => {
      // Arrange
      const error = new Error('Database error');
      User.create.mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.createUser(mockLogin, mockPassword)).rejects.toThrow(
        'Database error'
      );
    });

    it('should create user with very long login', async () => {
      // Arrange
      const longLogin = 'a'.repeat(100);
      const mockLongLoginUser = { ...mockUserData, login: longLogin };
      User.create.mockResolvedValue(mockLongLoginUser);

      // Act
      const result = await userRepository.createUser(longLogin, mockPassword);

      // Assert
      expect(result.login).toBe(longLogin);
      expect(result.login.length).toBe(100);
    });

    it('should create user with very long password', async () => {
      // Arrange
      const longPassword = 'b'.repeat(200);
      const mockLongPasswordUser = { ...mockUserData, password: longPassword };
      User.create.mockResolvedValue(mockLongPasswordUser);

      // Act
      const result = await userRepository.createUser(mockLogin, longPassword);

      // Assert
      expect(result.password).toBe(longPassword);
      expect(result.password.length).toBe(200);
    });

    it('should create user with empty password (should not happen in practice)', async () => {
      // Arrange
      const emptyPassword = '';
      const mockEmptyPasswordUser = { ...mockUserData, password: emptyPassword };
      User.create.mockResolvedValue(mockEmptyPasswordUser);

      // Act
      const result = await userRepository.createUser(mockLogin, emptyPassword);

      // Assert
      expect(result.password).toBe('');
    });

    it('should handle null values', async () => {
      // Arrange
      User.create.mockResolvedValue({ ...mockUserData, login: null, password: null });

      // Act
      const result = await userRepository.createUser(null, null);

      // Assert
      expect(User.create).toHaveBeenCalledWith({
        login: null,
        password: null,
      });
      expect(result.login).toBeNull();
      expect(result.password).toBeNull();
    });

    it('should handle special characters in login and password', async () => {
      // Arrange
      const specialLogin = 'user!@#$%^&*()_+';
      const specialPassword = 'pass!@#$%^&*()_+123';
      const mockSpecialUser = { ...mockUserData, login: specialLogin, password: specialPassword };
      User.create.mockResolvedValue(mockSpecialUser);

      // Act
      const result = await userRepository.createUser(specialLogin, specialPassword);

      // Assert
      expect(result.login).toBe(specialLogin);
      expect(result.password).toBe(specialPassword);
    });
  });
});
