import { Bible } from '../../models/Bible';
import { Book } from '../../models/Book';
import { Chapter } from '../../models/Chapter';
import { Verse } from '../../models/Verse';
import { getPercentageAdded, stringToInt } from '../../Utils';

class UpdateVerse {
  public init = async (
    bookName: string,
    chapterString: string,
    verseString: string
  ) => {
    try {
      const chapterNumber = stringToInt(chapterString);

      if (!chapterNumber) {
        console.log('Could not get chapter number in UpdateVerse');

        return;
      }

      const verseNumber = stringToInt(verseString);

      if (!verseNumber) {
        console.log('Could not get verse number in UpdateVerse');

        return;
      }

      const book = await Book.findOne({
        where: { name: bookName },
      });

      if (!book || !book.id) {
        console.log('Could not find book and/or book ID');

        return;
      }

      const chapter = await Chapter.findOne({
        where: {
          name: chapterNumber,
          bookId: book.id,
        },
      });

      if (!chapter || !chapter.id) {
        console.log('Could not find chapter and/or chapter ID');

        return;
      }

      const verse = await Verse.findOne({
        where: { chapterId: chapter.id, name: verseNumber },
        attributes: ['id'],
      });

      if (!verse || !verse.id) {
        console.log('Could not find verse and/or verse ID');

        return;
      }

      const bookId = book.id;

      const chapterId = chapter.id;

      const verseId = verse.id;

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
    } catch (e) {
      console.log('UpdateVerse error:', e);
    }
  };
}

export default UpdateVerse;
