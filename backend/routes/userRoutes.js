const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const router = express.Router();

router
    .get('/me', getUserProfile)

module.exports = router;
