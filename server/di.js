const GroupRepository = require('./repositories/groupRepository.js');
const TaskRepository = require('./repositories/taskRepository.js');
const UserRepository = require('./repositories/userRepository.js');
const TokenRepository = require('./repositories/tokenRepository.js');
const groupRepository = new GroupRepository();
const taskRepository = new TaskRepository();
const userRepository = new UserRepository();
const tokenRepository = new TokenRepository();

const AuthService = require('./service/authService.js');
const GroupService = require('./service/groupService.js');
const TaskService = require('./service/taskService.js');
const TokenService = require('./service/tokenService.js');
const UserService = require('./service/userService.js');

const authService = new AuthService(userRepository, tokenRepository);
const groupService = new GroupService(groupRepository);
const taskService = new TaskService(taskRepository, groupRepository);
const tokenService = new TokenService(tokenRepository);
const userService = new UserService(userRepository);

const AuthController = require('./controllers/authController.js');
const GroupController = require('./controllers/groupController.js');
const TaskController = require('./controllers/taskController.js');

const authController = new AuthController(authService);
const groupController = new GroupController(groupService);
const taskController = new TaskController(taskService);

module.exports = {
  authController,
  groupController,
  taskController,
};
