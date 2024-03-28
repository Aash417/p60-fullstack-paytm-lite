import { Request } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';

export const signupZod = z.object({
  username: z.string().trim(),
  password: z.string(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
});

export const loginZod = z.object({
  username: z.string(),
  password: z.string(),
});

export const updatePasswordZod = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export const updateAccountDetailsZod = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
});

export const transferMoneyZod = z.object({
  amount: z.number(),
  sendTo: z.string().trim(),
});

export const cookiesOptions: object = {
  httpOnly: true,
  secure: true,
};

export interface AuthRequest extends Request {
  // user: Types.ObjectId;
  user?: {
    _id: Types.ObjectId;
  };
}
