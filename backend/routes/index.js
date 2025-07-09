const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();


router.use('/users',authMiddleware, require('./userRoutes'));
router.use('/tasks', authMiddleware, require('./taskRoutes'));
router.use('/auth', require('./authRoutes'));


module.exports = router;
