const User = require("../models/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const createSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.cookie("jwt", token, options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.createSendResponse = createSendResponse;

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendResponse(newUser, 201, res);
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new CustomError(
      "Please provide email & password for login in!",
      400,
    );

    return next(error);
  }

  //? Checking if user exists with given email
  const user = await User.findOne({ email }).select("+password");

  // const isMatch = await user.comparePasswordInDB(password, user.password);

  if (!user || !(await user.comparePasswordInDB(password, user.password))) {
    const error = new CustomError("Incorrect email or password!", 400);

    return next(error);
  }
  createSendResponse(user, 200, res);
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  //* 1. Read & check the token

  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    const error = new CustomError("You are not logged in!", 401);

    next(error);
  }

  //* 2. Validate the token

  const decodedToken = jwt.verify(token, process.env.SECRET_STR);

  //* 3. If user exists

  const user = await User.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError(
      "The user with the given token is not exists!",
      401,
    );

    return next(error);
  }

  //* 4. If the user changed the password after the token was issued

  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    const error = new CustomError(
      "Password has been changed recently. Please login again.",
      401,
    );

    next(error);
  }

  //* 5. Allow access to user

  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        "You do not have permission to perform this section!",
        403,
      );

      next(error);
    }
    next();
  };
};

// exports.restrict = (...role) => {
//   return (req, res, next) => {
//     if (!role.includes(req.user.role)) {
//       const error = new CustomError(
//         "You do not have permission to perform this section!",
//         403,
//       );

//       next(error);
//     }
//     next();
//   };
// };

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //* 1. Get user based on posted email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    const error = new CustomError(
      "We could not find the user with given email",
      404,
    );

    next(error);
  }

  //* 2. Generate a random recent token

  const resetToken = user.crateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //* 3. Send the token back to the user email

  const resetURL = `${req.protocol}://${req.get(
    "host",
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `We have received a password reset request. Please use below link to reset your password\n\n${resetURL}\n\nThis reset password link will be valid only for 10 minutes.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password change request received",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link send to the user email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        "There was an error sending password reset email. Please, try again later.",
        500,
      ),
    );
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  //* 1. If user exists with the given token & token has not expired

  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    const error = new CustomError("Token is invalid or has been expired!", 400);

    next(error);
  }

  //* 2.Reseting the user password

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  //* 3. Login the user

  createSendResponse(user, 200, res);
});
