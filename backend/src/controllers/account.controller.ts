import { Response } from 'express';
import { startSession } from 'mongoose';
import { Account, User } from '../models/index';
import { AuthRequest, transferMoneyZod } from '../utils/helper';
import { ApiError, ApiResponse, asyncHandler } from '../utils/index';

export const getBalance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await Account.findOne({ userId: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, { balance: user.balance }, 'user balance fetched successfully.'));
});

export const transferMoney = asyncHandler(async (req: AuthRequest, res: Response) => {
  const session = await startSession();
  session.startTransaction();

  const inputvalidation = transferMoneyZod.safeParse(req.body);
  if (!inputvalidation.success)
    return res.status(422).json({
      inputvalidation,
    });

  const { amount, sendTo } = req.body;

  // 1. check if the user who send money exits and have enough money
  const senderAccount = await Account.findOne({ userId: req.user._id }).session(session);
  if (!senderAccount || senderAccount.balance < amount) {
    await session.abortTransaction();
    throw new ApiError(400, 'Insufficient balance');
  }

  // 2. check if user who receive money exists
  const receiver = await User.findOne({ username: sendTo }).session(session);
  if (!receiver) {
    await session.abortTransaction();
    throw new ApiError(404, 'User you are trying to send money does not have an bank account');
  }

  // 3. perform transaction
  await Account.updateOne({ userId: req.user._id }, { $inc: { balance: -amount } }).session(
    session
  );
  await Account.updateOne({ userId: receiver._id }, { $inc: { balance: amount } }).session(session);

  await session.commitTransaction();
  const remainingBal = await Account.findOne({ userId: req.user._id });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { success: true, remaining_Balance: remainingBal.balance },
        `Successfully transfer money to ${sendTo}`
      )
    );
});
