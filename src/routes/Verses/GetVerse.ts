import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { Bible } from '../../models/Bible';
import { Book } from '../../models/Book';
import { Chapter } from '../../models/Chapter';
import { Verse } from '../../models/Verse';
import { getPercentageAdded, stringToInt } from '../../Utils';

interface IRequest {
  bookName?: string;
  chapter?: string;
  verse?: string;
}

interface IResponse {
  bookName?: string;
  chapter?: number;
  verse?: number;
  success: boolean;
  message: string;
  text?: string;
  provableText?: string;
}

class GetVerse {
  public req: Request;
  public res: Response;
  public next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  public init = async () => {
    console.log('GetVerse request origin:', this.req.get('origin'));
    console.log('GetVerse request host:', this.req.get('host'));

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

      // Validate chapter
      if (!request.chapter) {
        return this.res.json({
          success: false,
          message: 'You must include chapter in your request params.',
        } as IResponse);
      }

      const chapterNumber = stringToInt(request.chapter);

      if (!chapterNumber) {
        return this.res.json({
          success: false,
          message: 'The chapter you provide must be an integer.',
        } as IResponse);
      }

      // Validate verse
      if (!request.verse) {
        return this.res.json({
          success: false,
          message: 'You must include chapter in your request params.',
        } as IResponse);
      }

      const verseNumber = stringToInt(request.verse);

      if (!verseNumber) {
        return this.res.json({
          success: false,
          message: 'The verse you provide must be an integer.',
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
          verse: verseNumber,
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
          verse: verseNumber,
        } as IResponse);
      }

      const verse = await Verse.findOne({
        where: { chapterId: chapter.id, name: verseNumber },
        attributes: ['text', 'id'],
      });

      if (!verse || !verse.text) {
        return this.res.json({
          success: false,
          message: 'A verse with the value provided could not be found',
          bookName: request.bookName,
          chapter: chapterNumber,
          verse: verseNumber,
        } as IResponse);
      }

      /**
       * Because this endpoint is only accessible by Provable, once we get
       * this far, we can assume the verse will be added to the blockchain.
       */
      await this.updateAdded(book.id, chapter.id, verse.id);

      return this.res.json({
        success: true,
        message: 'OK',
        bookName: book.name,
        chapter: chapter.name,
        verse: verseNumber,
        text: verse.text,
        provableText: `${request.bookName}---${chapterNumber}---${verseNumber}---${verse.text}`
      } as IResponse);
    } catch (e) {
      console.log('Get verses error:', e);

      this.res.json({
        success: false,
        message: `Could not get verse: ${e}`,
      } as IResponse);
    }
  };

  public updateAdded = async (
    bookId: string,
    chapterId: number,
    verseId: number
  ): Promise<boolean> => {
    try {
      await Verse.update({ added: true }, { where: { id: verseId } });

      const chapterVerses = await Verse.findAll({
        where: { chapterId },
        attributes: ['added'],
      });

      await Chapter.update(
        { percentageAdded: getPercentageAdded(chapterVerses) },
        { where: { id: chapterId } }
      );

      const bookChapters = await Chapter.findAll({
        where: { bookId },
        attributes: ['id'],
      });

      const bookChaptersIds = bookChapters.map(item => item.id);

      const bookVerses = await Verse.findAll({
        where: { chapterId: bookChaptersIds },
        attributes: ['added'],
      });

      await Book.update(
        { percentageAdded: getPercentageAdded(bookVerses) },
        { where: { id: bookId } }
      );

      const totalVerseCount = await Verse.count();

      const addedVerseCount = await Verse.count({ where: { added: true } });

      await Bible.update(
        { percentageAdded: Math.floor(addedVerseCount / totalVerseCount) },
        { where: { name: 'KJV' } }
      );

      return true;
    } catch (e) {
      console.log('update added error:', e);

      return false;
    }
  };
}

export default GetVerse;
