import { Dialect } from 'sequelize';
import { join } from 'path';

// TO DO: Put back commented out items done for testing

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
        url: 'wss://rinkeby.infura.io/ws',
      },
    },
    contracts: {
      theBible: {
        address: '0x2221742c84795deFFd4912304702708a6d9CA617',
        abiFileName: join(__dirname, 'contracts', 'TheBible_Rinkeby.json')
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
      // endpoint: process.env.INFURA_MAINNET_ENDPOINT as string,
      // projectId: process.env.INFURA_PROJECT_ID as string,
      // projectSecret: process.env.INFURA_PROJECT_SECRET as string,
      endpoint: process.env.INFURA_RINKEBY_ENDPOINT as string,
      projectId: process.env.INFURA_PROJECT_ID as string,
      projectSecret: process.env.INFURA_PROJECT_SECRET as string,
      websocket: {
        // url: 'wss://mainnet.infura.io/ws',
        url: 'wss://rinkeby.infura.io/ws',
      },
    },
    contracts: {
      theBible: {
        address: '0x2221742c84795deFFd4912304702708a6d9CA617',
        // abiFileName: join(__dirname, 'contracts', 'TheBible_Mainnet.json')
        abiFileName: join(__dirname, 'contracts', 'TheBible_Rinkeby.json')
      },
    },
  },
};

export default config;
