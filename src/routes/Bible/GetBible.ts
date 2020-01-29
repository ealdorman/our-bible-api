import { NextFunction, Request, Response } from 'express';

import { Bible } from '../../models/Bible';

interface IResponse {
  success: boolean;
  message: string;
  bible?: IBible;
}

interface IBible {
  name: string;
  percentageAdded: number;
}

class GetBible {
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
      const bible = (await Bible.findOne({
        where: { name: 'KJV' },
        attributes: ['name', 'percentageAdded'],
      })) as IBible;

      this.res.json({
        success: true,
        message: 'OK',
        bible,
      });
    } catch (e) {
      console.log('Get bible error:', e);

      this.res.json({
        success: false,
        message: `Could not get bible: ${e}`,
      } as IResponse);
    }
  };
}

export default GetBible;
