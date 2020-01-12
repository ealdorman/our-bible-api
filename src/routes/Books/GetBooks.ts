import { NextFunction, Request, Response } from 'express';

import { Book } from '../../models/Book';

interface IResponse {
  success: boolean;
  message: string;
  books: IBook[];
}

interface IBook {
  name: string;
  percentageAdded: number;
}

class GetBooks {
  public req: Request;
  public res: Response;
  public next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  public init = async () => {
    try {
      const allBooks = (await Book.findAll({
        attributes: ['name', 'percentageAdded'],
      })) as IBook[];

      this.res.json({
        success: true,
        message: 'OK',
        books: allBooks,
      });
    } catch (e) {
      console.log('Get books error:', e);

      this.res.json({
        success: false,
        message: `Could not get books: ${e}`,
        books: [],
      } as IResponse);
    }
  };
}

export default GetBooks;
