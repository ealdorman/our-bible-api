import { NextFunction, Request, Response } from 'express';
import * as rateLimit from 'express-rate-limit';

import Config from './config';

const config = Config[Config.env];

export const publicRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120,
});

export const setCors = (req: Request, res: Response, next: NextFunction) => {
  // TO DO: Make sure this works.
  res.header(Config.cors);

  next();
};
