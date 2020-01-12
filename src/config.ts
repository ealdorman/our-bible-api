import { Dialect } from 'sequelize';

interface IPlatform {
  port: number;
  db: {
    name: string;
    dialect: Dialect;
    username: string;
    password: string;
    host: string;
  };
  provable: {
    host: string;
  };
}

interface IConfig {
  env: 'dev' | 'prod';
  cors: {
    [key: string]: string | boolean;
  };
  dev: IPlatform;
  prod: IPlatform;
}

const config: IConfig = {
  env: process.env.NODE_ENV === 'dev' ? 'dev' : 'prod',
  cors: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  dev: {
    port: 3006,
    db: {
      name: 'dev_our_bible',
      dialect: process.env.DEV_DB_DIALECT as Dialect,
      username: process.env.DEV_DB_USERNAME as string,
      password: process.env.DEV_DB_PASSWORD as string,
      host: process.env.DEV_DB_HOST as string,
    },
    provable: {
      host: 'localhost:3006',
    },
  },
  prod: {
    port: 3007,
    db: {
      name: 'prod_our_bible',
      dialect: process.env.PROD_DB_DIALECT as Dialect,
      username: process.env.PROD_DB_USERNAME as string,
      password: process.env.PROD_DB_PASSWORD as string,
      host: process.env.PROD_DB_HOST as string,
    },
    provable: {
      host: 'localhost:3006',
    },
  },
};

export default config;
