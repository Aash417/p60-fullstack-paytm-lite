import { Request } from 'express';
import { z } from 'zod';
import { userDocument } from '../models/user.model';

export const signupZod = z.object({
  username: z.string(),
  password: z.string().min(4),
});

export const loginZod = z.object({
  username: z.string(),
  password: z.string().min(4),
});
export const cookiesOptions: object = {
  httpOnly: true,
  secure: true,
};

export interface AuthRequest extends Request {
  user?: userDocument;
}
