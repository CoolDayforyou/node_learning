const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { createSendResponse } = require("../controllers/authController");

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  //* Get current user from DB

  const user = await User.findById(req.user._id).select("+password");

  //* Check if the supplied current password is correct

  if (
    !(await user.comparePasswordInDB(req.body.currentPassword, user.password))
  ) {
    const error = new CustomError(
      "The current password you provided is wrong!",
      401,
    );

    return next(error);
  }

  //* If supplied password is correct, update user password with the new value

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  await user.save();

  //* Login user & send jwt

  createSendResponse(user, 200, res);
});

exports.updateMe = asyncErrorHandler(async (req, res, next) => {
  // * 1. Check if request data contain password | confirmPassword

  if (req.body.password || req.body.confirmPassword) {
    const error = new CustomError(
      "You can not update your password using this endpoint",
      400,
    );
    return next(error);
  }

  //* 2. Update user details

  const filterObj = filterReqObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = asyncErrorHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
