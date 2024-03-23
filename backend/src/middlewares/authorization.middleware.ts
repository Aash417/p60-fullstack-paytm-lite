import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { AuthRequest } from '../utils/helper';
import { ApiError, asyncHandler } from '../utils/index';

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string;

    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
      throw new ApiError(
        401,
        'You are not logged in, Please login to get access'
      );

    const decodedToken: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload;

    const user = await User.findById(decodedToken?._id).select('-password');
    if (!user)
      next(
        new ApiError(401, 'The user belonging to this token does not exists.')
      );

    // add a property user to the req and then head to the next middleware
    req.user = user;
    next();
  }
);
