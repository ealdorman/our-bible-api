import { NextFunction, Request, Response } from 'express';
import { isEmpty, orderBy } from 'lodash';

import { Book } from '../../models/Book';
import { Chapter } from '../../models/Chapter';
import { Verse } from '../../models/Verse';
import { stringToInt } from '../../Utils';

interface IRequest {
  bookName?: string;
  chapter?: string;
}

interface IResponse {
  bookName?: string;
  chapter?: number;
  success: boolean;
  message: string;
  verses: Partial<Verse>;
}

class GetVerses {
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
        verses: [],
      } as IResponse);
    }

    try {
      const request = this.req.params as IRequest;

      if (!request.bookName) {
        return this.res.json({
          success: false,
          message: 'You must include bookName in your request params.',
          verses: [],
        } as IResponse);
      }

      if (!request.chapter) {
        return this.res.json({
          success: false,
          message: 'You must include chapter in your request params.',
          verses: [],
        } as IResponse);
      }

      const chapterNumber = stringToInt(request.chapter);

      if (!chapterNumber) {
        return this.res.json({
          success: false,
          message: 'The chapter you provide must be an integer.',
          verses: [],
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
          chapter: chapterNumber,
          verses: [],
        } as IResponse);
      }

      const chapter = await Chapter.findOne({
        where: {
          name: chapterNumber,
          bookId: book.id,
        },
      });

      if (!chapter || !chapter.id) {
        return this.res.json({
          success: false,
          message: 'A chapter with the value provided could not be found',
          bookName: request.bookName,
          chapter: chapterNumber,
          verses: [],
        } as IResponse);
      }

      const allVerses = await Verse.findAll({
        where: { chapterId: chapter.id },
        attributes: ['name', 'added', 'text'],
      });

      return this.res.json({
        success: true,
        message: 'OK',
        bookName: book.name,
        chapter: chapter.name,
        verses: orderBy(allVerses, 'name', 'asc'),
      } as IResponse);
    } catch (e) {
      console.log('Get verses error:', e);

      this.res.json({
        success: false,
        message: `Could not get verses: ${e}`,
        verses: [],
      } as IResponse);
    }
  };
}

export default GetVerses;
