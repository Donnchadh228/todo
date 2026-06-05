/**
 * @swagger
 * /group:
 *   post:
 *     summary: Create a new group
 *     tags: [Group]
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
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 11
 *                 name:
 *                   type: string
 *                   example: "newName"
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-06-05T12:45:25.745Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-06-05T12:45:25.745Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /group:
 *   get:
 *     summary: Get all groups with pagination
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of groups per page
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
 *           enum: [createdAt, updatedAt, name]
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
 *     responses:
 *       200:
 *         description: List of groups with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of groups
 *                   example: 5
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 11
 *                       name:
 *                         type: string
 *                         example: "newName"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-05T12:45:25.745Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-05T12:45:25.745Z"
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       tasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "etert"
 *                 limit:
 *                   type: integer
 *                   description: Number of groups per page
 *                   example: 2
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /group/{id}:
 *   put:
 *     summary: Update a group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
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
 *                 example: "newName"
 *     responses:
 *       200:
 *         description: Group updated successfully
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
 *                   example: "newName"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-05-03T12:37:59.418Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-06-05T12:49:28.858Z"
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 */

/**
 * @swagger
 * /group/{id}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Group deleted successfully
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
 *         description: Group not found
 */
