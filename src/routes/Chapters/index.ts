import { Router } from 'express';

import GetChapters from './GetChapters';

export const chapters = Router();

chapters.get('/:bookName', async (req, res, next) =>
  new GetChapters(req, res, next).init()
);
