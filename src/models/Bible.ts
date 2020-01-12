import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Book } from './Book';

@Table
export class Bible extends Model<Bible> {
  @Column(DataType.STRING(30))
  public name!: string;

  @Column
  public percentageAdded!: number;

  @HasMany(() => Book)
  public books?: Array<Partial<Book>>;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
