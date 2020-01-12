import { NextFunction, Request, Response } from 'express';
import { isEmpty, orderBy } from 'lodash';

import { Book } from '../../models/Book';
import { Chapter } from '../../models/Chapter';

interface IRequest {
  bookName?: string;
}

interface IResponse {
  bookName?: string;
  success: boolean;
  message: string;
  chapters: Partial<Chapter>;
}

class GetChapters {
  public req: Request;
  public res: Response;
  public next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  public init = async () => {
    if (!this.req.params || isEmpty(this.req.params)) {
      return this.res.json({
        success: false,
        message: 'You must include bookName in your request params.',
        chapters: [],
      } as IResponse);
    }

    try {
      const request = this.req.params as IRequest;

      if (!request.bookName) {
        return this.res.json({
          success: false,
          message: 'You must include bookName in your request params.',
          chapters: [],
        } as IResponse);
      }

      const book = await Book.findOne({
        where: { name: decodeURIComponent(request.bookName) },
      });

      if (!book || !book.id) {
        return this.res.json({
          success: false,
          message: 'A book with the name provided could not be found',
          bookName: request.bookName,
          chapters: [],
        } as IResponse);
      }

      const allChapters = await Chapter.findAll({
        where: { bookId: book.id },
        attributes: ['name', 'percentageAdded'],
      });

      return this.res.json({
        success: true,
        message: 'OK',
        bookName: book.name,
        chapters: orderBy(allChapters, 'name', 'asc'),
      } as IResponse);
    } catch (e) {
      console.log('Get chapters error:', e);

      this.res.json({
        success: false,
        message: `Could not get chapters: ${e}`,
        chapters: [],
      } as IResponse);
    }
  };
}

export default GetChapters;
