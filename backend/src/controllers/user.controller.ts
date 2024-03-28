import { Request, Response } from 'express';
import { Account, User } from '../models/index';
import {
  AuthRequest,
  cookiesOptions,
  loginZod,
  signupZod,
  updatePasswordZod,
} from '../utils/helper';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const inputValidation = signupZod.safeParse(req.body);
  if (!inputValidation.success)
    return res.status(422).json({
      inputValidation,
    });

  const { username, password, firstName, lastName } = req.body;
  const user = await User.create({
    username: username.toLowerCase(),
    password,
    firstName,
    lastName,
  });

  await Account.create({
    userId: user._id,
    balance: Math.floor(Math.random() * 10000) + 1,
  });

  const createdUser = await User.findById(user._id).select('-password -_id -__v -updatedAt');
  if (!createdUser) throw new ApiError(500, 'Something went wrong while registering user.');

  return res
    .status(201)
    .json(new ApiResponse(200, { createdUser }, 'user registered successfully'));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const inputvalidation = loginZod.safeParse(req.body);
  if (!inputvalidation.success)
    return res.status(422).json({
      inputvalidation,
    });

  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');
  if (!user) throw new ApiError(404, 'User does not exist');

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, 'Incorrect password.');

  const accessToken = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select(
    '-_id -password -__v -createdAt -updatedAt'
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          paytmToken: accessToken,
        },
        'Logged in successfully'
      )
    );
});

export const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  return res
    .status(200)
    .clearCookie('accessToken', cookiesOptions)
    .json(new ApiResponse(200, { data: 'logged out' }, 'Logged out successfully'));
});

export const updatePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const inputValidation = updatePasswordZod.safeParse(req.body);
  if (!inputValidation.success)
    return res.status(422).json({
      inputValidation,
    });

  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(400, 'Incorrect old password');

  if (oldPassword === newPassword) throw new ApiError(400, 'New password can not be old password');
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { newPassword }, 'Password updated successfully'));
});

export const updateAccountDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName } = req.body;

  if (!firstName && !lastName) throw new ApiError(500, 'Provide at least one field to update');
  type fieldType = {
    firstName?: string;
    lastName?: string;
  };
  const updateFields: fieldType = {};

  if (firstName) {
    updateFields.firstName = firstName;
  }
  if (lastName) {
    updateFields.lastName = lastName;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
  }).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'account details updated successfully'));
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const filter = req.query.filter || '';

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  const user = users.map(user => ({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    _id: user._id,
  }));

  return res.status(200).json(new ApiResponse(200, user, 'user data fetched.'));
});

export const checkUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user });
});

export const test = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  res.json({
    msg: 'working',
    user,
  });
});
