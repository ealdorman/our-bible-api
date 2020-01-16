import * as allBooks from './allBooks.json';

import { Bible } from '../models/Bible';
import { Book } from '../models/Book';
import { Chapter } from '../models/Chapter';
import { Verse } from '../models/Verse';

interface IChapter {
  chapter: string;
  verses: IVerse[];
}

interface IVerse {
  verse: string;
  text: string;
}

class SeedData {
  public init = async () => {
    const bibleRows = await Bible.count();

    if (bibleRows > 0) {
      return;
    }

    const bible = await Bible.create({
      name: 'KJV',
      percentageAdded: 0,
    });

    for (const bookName of Object.keys(allBooks)) {
      const bookObject: Partial<Book> = {
        name: bookName,
        percentageAdded: 0,
        bibleId: bible.id,
        chapters: [],
      };

      const book = (allBooks as { [propName: string]: IChapter[] })[bookName];

      book.map(bookChapter => {
        const verses: Array<Partial<Verse>> = [];

        try {
          bookChapter.verses.map(verse => {
            verses.push({
              name: parseInt(verse.verse, 10),
              text: verse.text,
              added: false,
            });
          });
        } catch (e) {
          console.log('Seed data bookChapter.verses error:', e);
        }

        try {
          if (bookObject.chapters) {
            bookObject.chapters.push({
              name: parseInt(bookChapter.chapter, 10),
              percentageAdded: 0,
              verses,
            });
          }
        } catch (e) {
          console.log('Seed data bookObject.chapters error:', e);
        }
      });

      try {
        await Book.create(bookObject, {
          include: [
            {
              model: Chapter,
              include: [
                {
                  model: Verse,
                },
              ],
            },
          ],
        });
      } catch (e) {
        console.log('Book create error:', e);
      }
    }
  };
}

export default SeedData;
