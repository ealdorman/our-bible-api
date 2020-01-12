import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Bible } from './Bible';
import { Chapter } from './Chapter';

@Scopes(() => ({
  chapters: {
    include: [
      {
        model: Chapter,
        through: {
          attributes: [],
        },
      },
    ],
  },
}))
@Table
export class Book extends Model<Book> {
  @Column(DataType.STRING(20))
  public name!: string;

  @Column
  public percentageAdded!: number;

  @HasMany(() => Chapter)
  public chapters?: Array<Partial<Chapter>>;

  @ForeignKey(() => Bible)
  @Column
  public bibleId?: number;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
