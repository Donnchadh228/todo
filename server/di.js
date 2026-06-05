// REPO
const GroupRepository = require('./repositories/groupRepository.js');
const TaskRepository = require('./repositories/taskRepository.js');
const UserRepository = require('./repositories/userRepository.js');
const TokenRepository = require('./repositories/tokenRepository.js');

const groupRepository = new GroupRepository();
const taskRepository = new TaskRepository();
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();

// SERVICES
const AuthService = require('./service/authService.js');
const GroupService = require('./service/groupService.js');
const TaskService = require('./service/taskService.js');
const TokenService = require('./service/tokenService.js');
const UserService = require('./service/userService.js');

const userService = new UserService(userRepository);
const tokenService = new TokenService(tokenRepository);
const authService = new AuthService(userService, tokenService);
const groupService = new GroupService(groupRepository);
const taskService = new TaskService(taskRepository, groupService);

// MIDDLEWARE
const authMiddleware = require('./middleware/authMiddleware.js')(tokenService);
const errorMiddleware = require('./middleware/errorMiddleware.js');
const validationMiddleware = require('./middleware/validationMiddleware.js');

// CONTROLLERS
const AuthController = require('./controllers/authController.js');
const GroupController = require('./controllers/groupController.js');
const TaskController = require('./controllers/taskController.js');

const authController = new AuthController(authService, tokenService, userService);
const groupController = new GroupController(groupService);
const taskController = new TaskController(taskService);

// ===== EXPORTS =====
module.exports = {
  // Services
  authService,
  groupService,
  taskService,
  tokenService,
  userService,

  // Controllers
  authController,
  groupController,
  taskController,

  // Middlewares
  authMiddleware,
  errorMiddleware,
  validationMiddleware,
};
