import { Request, Response } from 'express';
import User from '../models/user.model';
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

  const createdUser = await User.findById(user._id).select('-password -_id -__v -updatedAt');
  if (!createdUser) throw new ApiError(500, 'Something went wrong while registering user.');

  return res
    .status(201)
    .json(new ApiResponse(200, { createdUser }, 'user registered successfully'));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const inputValidation = loginZod.safeParse(req.body);
  if (!inputValidation.success)
    return res.status(422).json({
      inputValidation,
    });

  const { username, password } = req.body;

  const user = await User.findOne({ username });
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
    .json(new ApiResponse(200, { user: loggedInUser }, 'Logged in successfully'));
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
  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(400, 'Incorrect old password');

  if (oldPassword === newPassword) throw new ApiError(400, 'New password cannt be old password');
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { newPassword }, 'Password updated successfully'));
});

export const test = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  res.json({
    msg: 'working',
    user,
  });
});
