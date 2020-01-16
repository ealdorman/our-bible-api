const Web3 = require('web3');

import Config from '../config';
import UpdateVerse from '../routes/Verses/UpdateVerse';

const config = Config[Config.env];

let theBible: any;

try {
  theBible = require(config.contracts.theBible.abiFileName);
} catch (_) {}

interface IEvent {
  removed: boolean;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  id: string;
  returnValues: ILogVerseAddedResult;
  event: 'LogVerseAdded' | 'LogError' | 'LogNewProvableQuery';
  signature: string;
  raw: {
    data: string;
    topics: string[];
  };
}

interface ILogVerseAddedResult {
  '0': string;
  '1': string;
  '2': string;
  book: string;
  chapter: string;
  verse: string;
}

class Infura {
  public initializeWebsocket = () => {
    if (!theBible) {
      console.log('No contract provided.');

      return;
    }

    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(config.infura.websocket.url)
    );

    const TheBible = new web3.eth.Contract(
      theBible.abi,
      config.contracts.theBible.address
    );

    try {
      TheBible.events
        .LogVerseAdded()
        .on('data', (event: IEvent) => {
          console.log('LogVerseAdded event:', event);

          try {
            const resultValues = event.returnValues;

            if (
              !resultValues ||
              !resultValues.book ||
              !resultValues.chapter ||
              !resultValues.verse
            ) {
              console.log(
                'Requisite value(s) missing in LogVerseAdded event data'
              );
            }

            new UpdateVerse().init(
              resultValues.book,
              resultValues.chapter,
              resultValues.verse
            );
          } catch (error) {
            console.log('LogVerseAdded event data error:', error);
          }
        })
        .on('error', (error: any) => {
          console.log('LogVerseAdded event error:', error);
        })
        .on('end', (e: any) => {
          console.log('LogVerseAdded websocket closed:', e);

          this.reconnectToWebsocket();
        });
    } catch (e) {
      console.log('LogVerseAdded catch error:', e);
    }
  };

  public reconnectToWebsocket = () => {
    setTimeout(() => {
      this.initializeWebsocket();
    }, 2000);
  };
}

export default Infura;
