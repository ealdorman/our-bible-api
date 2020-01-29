import { Router } from 'express';

import GetBooks from './GetBooks';

export const books = Router();

books.get('', async (req, res, next) => new GetBooks(req, res, next).init());
