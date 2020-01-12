import { Sequelize } from 'sequelize-typescript';

import Config from './config';

const config = Config[Config.env];

export const sequelize = new Sequelize({
  database: config.db.name,
  dialect: config.db.dialect,
  username: config.db.username,
  password: config.db.password,
  storage: ':memory:',
  models: [__dirname + '/models'],
  host: config.db.host,
});
