const { hashPassword } = require('../helpers/hash.helper');
const db = require('../models/index');

const createUserRepo = async (userData) => {
    try {
        const hashedPassword = await hashPassword(userData.password);
        const user = await db.User.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword, // assume already hashed or validated
        });
        return user
    } catch (error) {
        console.log(error)
    }
}

const getUserRepo = async (userId) => {
  try {
    const user = await db.User.findByPk(userId); 
    return user?.get({ plain: true });
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; 
  }
};
const getUserByEmailRepo = async (email) => {
  try {
    const user = await db.User.findOne({
      where: { email },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

module.exports = { createUserRepo, getUserRepo, getUserByEmailRepo }