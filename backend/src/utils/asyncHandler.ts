import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/ban-types
export const asyncHandler = (requestHandler: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};
