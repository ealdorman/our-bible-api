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

import { Book } from './Book';
import { Verse } from './Verse';

@Scopes(() => ({
  verses: {
    include: [
      {
        model: Verse,
        through: {
          attributes: [],
        },
      },
    ],
  },
}))
@Table
export class Chapter extends Model<Chapter> {
  @Column(DataType.INTEGER())
  public name!: number;

  @Column
  public percentageAdded!: number;

  @HasMany(() => Verse)
  public verses?: Array<Partial<Verse>>;

  @ForeignKey(() => Book)
  @Column
  public bookId?: number;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
