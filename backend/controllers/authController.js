const asyncHandler = require('express-async-handler');
const { createUserRepo, getUserByEmailRepo } = require('../repositories/userRepo');
const { createResponse } = require('../helpers/response.helper');
const { comparePassword } = require('../helpers/hash.helper');
const { generateTokens } = require('../services/token.service');


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmailRepo(email);
  if (!user) {
    return res.status(401).send(createResponse(null, 'Invalid credentials'));
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).send(createResponse(null, "Invalid Password"));
  }
  const tokens = await generateTokens({ id: user.id });
  res.status(200).send(createResponse(tokens, ""));
});

const registerUser = asyncHandler(async (req, res) => {
  const {email} = req.body;
  const isUserPresent = await getUserByEmailRepo(email);
  if(isUserPresent){
    res.status(404).send(createResponse(null, 'Please login. You have registered already'))
    return;  
  }
const {password, ...remainingUser} = await createUserRepo(req.body);
  res.status(201).send(createResponse(remainingUser, 'User registered successfully'))
});

module.exports = { loginUser, registerUser };
