import { filter } from 'lodash';
import isInt from 'validator/lib/isInt';

import { Verse } from '../models/Verse';

export const stringToInt = (s?: string): number | null => {
  if (!s) {
    return null;
  }

  if (!isInt(s)) {
    return null;
  }

  try {
    return Number(s);
  } catch (e) {
    console.log('Could not convert string to int:', e);

    return null;
  }
};

export const getPercentageAdded = (verses: Array<Partial<Verse>>): number => {
  try {
    const added = filter(verses, o => o.added).length;

    const notAdded = verses.length - added;

    if (notAdded === 0) {
      return 100;
    }

    return Math.floor(100 * (added / verses.length));
  } catch (e) {
    console.log('getPercentageAdded error:', e);

    return 0;
  }
};
