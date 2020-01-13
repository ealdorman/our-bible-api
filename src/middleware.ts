import { NextFunction, Request, Response } from 'express';
import * as rateLimit from 'express-rate-limit';

import Config from './config';

const config = Config[Config.env];

export const publicRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120,
});

export const restrictToProvable = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('restrictToProvable host:', req.get('host'));
  console.log('X-Forwarded-For:', req.headers['X-Forwarded-For']);
  console.log('X-Real-IP:', req.headers['X-Real-IP']);


  // TO DO: The host is almost certainly wrong. Need to figure out how to limit
  // this to calls from Provable.

  if (req.get('host') !== config.provable.host) {
    return res.status(403).send({
      success: false,
      message: 'This route is restricted.',
    });
  }

  next();
};

export const setCors = (req: Request, res: Response, next: NextFunction) => {
  // TO DO: Make sure this works.
  res.header(Config.cors);

  next();
};
