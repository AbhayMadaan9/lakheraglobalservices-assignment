const express = require("express");
const router = express.Router();

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { createUserSchema, loginUser: loginUserValidation } = require("../schemaValidations/auth.validation");
const validateRequest = require("../middlewares/validateRequest.middleware");
const { loginUser, registerUser } = require("../controllers/authController");


router
    .post('/login', validateRequest(loginUserValidation), loginUser)
    .post('/register',validateRequest(createUserSchema), registerUser)

module.exports = router;
