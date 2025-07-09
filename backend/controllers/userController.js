const asyncHandler = require('express-async-handler');
const { createUserRepo, getUserRepo } = require('../repositories/userRepo');
const {createResponse} = require('../helpers/response.helper');


const createUser = asyncHandler(async (req, res) => {
  const {password, ...user} = await createUserRepo(req.body);
  res.status(201).send(createResponse(user, 'User registered successfully'))
});


const getUserProfile = asyncHandler(async (req, res) => {
  if(!req.user.id){
    throw new Error("Unauthenticated User")
  }
  const {password, ...user} = await getUserRepo(req.user.id);
  res.status(201).send(createResponse(user, 'User fetched successfully'))
});

module.exports = { createUser, getUserProfile };
