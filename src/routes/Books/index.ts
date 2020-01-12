import { Router } from 'express';

import { publicRateLimit } from '../../middleware';
import GetBooks from './GetBooks';

export const books = Router();

books.get('', publicRateLimit, async (req, res, next) =>
  new GetBooks(req, res, next).init()
);
