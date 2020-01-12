import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Chapter } from './Chapter';

@Table
export class Verse extends Model<Verse> {
  @Column(DataType.INTEGER())
  public name!: number;

  @Column(DataType.STRING(550))
  public text!: string;

  @Column
  public added!: boolean;

  @ForeignKey(() => Chapter)
  @Column
  public chapterId?: number;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
