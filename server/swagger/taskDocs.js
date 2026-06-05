/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "newName"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 id:
 *                   type: integer
 *                   example: 13
 *                 name:
 *                   type: string
 *                   example: "newName"
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 groupId:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-06-05T13:18:30.104Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-06-05T13:18:30.104Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks with pagination
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tasks per page
 *         example: 2
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, status]
 *           default: createdAt
 *         description: Field to sort by
 *         example: "createdAt"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *         example: "DESC"
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: integer
 *         description: Filter tasks by group ID
 *         example: 7
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filter tasks by status (true/false)
 *         example: false
 *     responses:
 *       200:
 *         description: List of tasks with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of tasks
 *                   example: 7
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 13
 *                       name:
 *                         type: string
 *                         example: "newName"
 *                       status:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-05T13:18:30.104Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-05T13:18:30.104Z"
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       groupId:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *                       group:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "xzc"
 *                 limit:
 *                   type: integer
 *                   description: Number of tasks per page
 *                   example: 2
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "xzc"
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-03T12:37:55.445Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-28T12:56:32.679Z"
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 groupId:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated task name"
 *               status:
 *                 type: boolean
 *                 example: true
 *               groupId:
 *                 type: integer
 *                 nullable: true
 *                 description: Group ID to assign task to (null to remove from group)
 *                 example: 7
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Updated task name"
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *                 groupId:
 *                   type: integer
 *                   nullable: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
