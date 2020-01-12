import { Router } from 'express';

import { publicRateLimit, restrictToProvable } from '../../middleware';
import GetVerse from './GetVerse';
import GetVerses from './GetVerses';

export const verses = Router();

verses.get('/:bookName/:chapter', publicRateLimit, async (req, res, next) =>
  new GetVerses(req, res, next).init()
);

verses.get(
  '/:bookName/:chapter/:verse',
  restrictToProvable,
  async (req, res, next) => new GetVerse(req, res, next).init()
);
