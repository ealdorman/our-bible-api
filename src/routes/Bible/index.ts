import { Router } from 'express';

import GetBible from './GetBible';

export const bible = Router();

bible.get('', async (req, res, next) => new GetBible(req, res, next).init());
