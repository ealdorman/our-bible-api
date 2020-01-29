import { Router } from 'express';

import GetRandomVerse from './GetRandomVerse';
import GetVerse from './GetVerse';
import GetVerses from './GetVerses';

export const verses = Router();

verses.get('/random', async (req, res, next) =>
  new GetRandomVerse(req, res, next).init()
);

verses.get('/:bookName/:chapter', async (req, res, next) =>
  new GetVerses(req, res, next).init()
);

verses.get('/:bookName/:chapter/:verse', async (req, res, next) =>
  new GetVerse(req, res, next).init()
);
