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
  console.log('origin:', req.get('origin'));
  console.log('X-Forwarded-For:', req.get('X-Forwarded-For'));
  console.log('X-Real-IP:', req.get('X-Real-IP'));
  console.log('X-Real-Origin:', req.get('X-Real-Origin'));
  // console.log('hostname:', req.hostname);
  console.log('headers:', req.headers);
  // console.log('request:', req);
  


  // TO DO: The host is almost certainly wrong. Need to figure out how to limit
  // this to calls from Provable.

  // if (req.get('host') !== config.provable.host) {
  //   return res.status(403).send({
  //     success: false,
  //     message: 'This route is restricted.',
  //   });
  // }

  next();
};

export const setCors = (req: Request, res: Response, next: NextFunction) => {
  // TO DO: Make sure this works.
  res.header(Config.cors);

  next();
};
