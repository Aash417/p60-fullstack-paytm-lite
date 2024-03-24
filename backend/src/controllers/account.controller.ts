import { Response } from 'express';
import { Account } from '../models/index';
import { AuthRequest } from '../utils/helper';
import { ApiResponse, asyncHandler } from '../utils/index';

export const getBalance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await Account.findOne({ userId: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, { balance: user.balance }, 'user balance fetched successfully.'));
});
