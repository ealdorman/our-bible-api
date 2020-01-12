import { Router } from 'express';

import { publicRateLimit } from '../../middleware';
import GetChapters from './GetChapters';

export const chapters = Router();

chapters.get('/:bookName', publicRateLimit, async (req, res, next) =>
  new GetChapters(req, res, next).init()
);
