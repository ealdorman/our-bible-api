import { join } from 'path';
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
  infura: {
    endpoint: string;
    projectId: string;
    projectSecret: string;
    websocket: {
      url: string;
    };
  };
  contracts: {
    theBible: {
      address: string;
      abiFileName: string;
    };
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
    infura: {
      endpoint: process.env.INFURA_RINKEBY_ENDPOINT as string,
      projectId: process.env.INFURA_PROJECT_ID as string,
      projectSecret: process.env.INFURA_PROJECT_SECRET as string,
      websocket: {
        url: `wss://rinkeby.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID as string}`,
      },
    },
    contracts: {
      theBible: {
        address: '0x9725a0211937a3401c2123f2707c5c99e5882633',
        abiFileName: join(__dirname, 'contracts', 'TheBible_Rinkeby.json'),
      },
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
    infura: {
      endpoint: process.env.INFURA_MAINNET_ENDPOINT as string,
      projectId: process.env.INFURA_PROJECT_ID as string,
      projectSecret: process.env.INFURA_PROJECT_SECRET as string,
      websocket: {
        url: `wss://mainnet.infura.io/ws/${process.env.INFURA_PROJECT_ID as string}`,
      },
    },
    contracts: {
      theBible: {
        address: '',
        abiFileName: join(__dirname, 'contracts', 'TheBible_Mainnet.json'),
      },
    },
  },
};

export default config;
