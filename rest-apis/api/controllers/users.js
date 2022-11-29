const Boom = require('@hapi/boom');

const UsersModel = require('../models/users');

const createNewUser = async (req) => {
  try {
    const userFound = await UsersModel.findOne({ email: req.payload.email.toLowerCase() });
    if (userFound) {
      return Boom.conflict('User with this email already exists');
    }
    const user = new UsersModel(req.payload);
    return await user.save();
  } catch (error) {
    console.log(error.message);
    return Boom.badImplementation();
  }
};

const getAllUsers = async () => {
  try {
    return await UsersModel.find().select('-password');
  } catch (error) {
    console.log(error.message);
    return Boom.badImplementation();
  }
};

const getUserDetails = async (req) => {
  try {
    const userFound = await UsersModel.findOne({ _id: req.params.userId }).select('-password');
    if (!userFound) {
      return Boom.notFound("User with this user id doesn't exists");
    }
    return userFound;
  } catch (error) {
    console.log(error.message);
    return Boom.badImplementation();
  }
};

const updateUserDetails = async (req) => {
  try {
    const userFound = await UsersModel.findOne({ _id: req.params.userId });
    if (!userFound) {
      return Boom.notFound("User with this user id doesn't exists");
    }
    return await UsersModel.updateOne({ _id: req.params.userId }, req.payload);
  } catch (error) {
    console.log(error.message);
    return Boom.badImplementation();
  }
};

const deleteUserDetails = async (req) => {
  try {
    const userFound = await UsersModel.findOne({ _id: req.params.userId });
    if (!userFound) {
      return Boom.notFound("User with this user id doesn't exists");
    }
    return await UsersModel.deleteOne({ _id: req.params.userId });
  } catch (error) {
    console.log(error.message);
    return Boom.badImplementation();
  }
};

module.exports = {
  createNewUser,
  getAllUsers,
  getUserDetails,
  updateUserDetails,
  deleteUserDetails,
};
