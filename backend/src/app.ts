import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import userRouter from './routes/user.routes';
import { ApiError, errorHandler } from './utils/index';

const app = express();

// Global middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(compression());

// Routes
app.use('/api/v1/users', userRouter);


// Global error handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});
app.use(errorHandler);
export { app };

