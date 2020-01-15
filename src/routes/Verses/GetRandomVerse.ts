import { NextFunction, Request, Response } from 'express';

import { Book } from '../../models/Book';
import { Chapter } from '../../models/Chapter';
import { Verse } from '../../models/Verse';

interface IResponse {
  bookName?: string;
  chapter?: number;
  verse?: number;
  success: boolean;
  message: string;
  text?: string;
  provableText?: string;
}

class GetRandomVerse {
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
      const verse = await Verse.findOne({ where: { added: false } });

      if (!verse || !verse.chapterId || !verse.text || !verse.name) {
        return this.res.json({
          success: false,
          message: 'Could not find a random verse that has not been added.',
        } as IResponse);
      }

      const chapter = await Chapter.findOne({ where: { id: verse.chapterId } });

      if (!chapter || !chapter.bookId || !chapter.name) {
        return this.res.json({
          success: false,
          message:
            'Could not find the chapter associated with the random verse.',
        } as IResponse);
      }

      const book = await Book.findOne({ where: { id: chapter.bookId } });

      if (!book || !book.name) {
        return this.res.json({
          success: false,
          message: 'Could not find the book associated with the random verse.',
        } as IResponse);
      }

      return this.res.json({
        success: true,
        message: 'OK',
        bookName: book.name,
        chapter: chapter.name,
        verse: verse.name,
        text: verse.text,
        provableText: `${book.name}---${chapter.name}---${verse.name}---${verse.text}`,
      } as IResponse);
    } catch (e) {
      console.log('GetRandomVerse error:', e);
    }
  };
}

export default GetRandomVerse;
