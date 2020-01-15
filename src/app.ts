import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import * as bodyParser from 'body-parser';
import * as express from 'express';

import Config from './config';
import Infura from './Infura';
import SeedData from './KJVBible/SeedData';
import { setCors } from './middleware';
import { books } from './routes/Books';
import { chapters } from './routes/Chapters';
import { verses } from './routes/Verses';
import { sequelize } from './sequelize';

const config = Config[Config.env];

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.set('trust proxy', 1);
app.use(setCors);

app.get('/', (_, res) => {
  res.sendStatus(200);
});

app.use('/books', books);
app.use('/chapters', chapters);
app.use('/verses', verses);

sequelize
  .sync()
  .then(async () => {
    await new SeedData().init();

    new Infura().initializeWebsocket();

    app.listen(config.port, () => {
      console.log(`Listening in ${Config.env} on port ${config.port}.`);
    });
  })
  .catch(e => {
    console.log('sequelize sync error:', e);
  });
