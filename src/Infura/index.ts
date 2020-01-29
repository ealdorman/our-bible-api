const Web3 = require('web3');
import { find } from 'lodash';

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
  data: string;
  topics: string[];
  id: string;
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
  newBlockHeadersSubscription: any;
  bibleContractSubscription: any;

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

    // Keep the Infura connection alive by subscribing to newBlockHeaders
    this.newBlockHeadersSubscription = web3.eth
      .subscribe('newBlockHeaders')
      .on('data', (_: any) => {
        console.log('Infura connection still alive');
      })
      .on('error', (error: any) => {
        console.log('newBlockHeaders subscription error:', error);
      })
      .on('end', (e: any) => {
        console.log('newBlockHeaders websocket closed:', e);

        this.unsubscribeListeners();

        this.reconnectToWebsocket();
      });

    const logVerseAddedSignature = find(
      TheBible._jsonInterface,
      o => o.name === 'LogVerseAdded'
    ).signature;

    this.bibleContractSubscription = web3.eth
      .subscribe('logs', {
        address: [config.contracts.theBible.address],
        topics: [logVerseAddedSignature],
      })
      .on('data', (e: IEvent) => {
        console.log('LogVerseAdded event:', e);

        try {
          const decoded: ILogVerseAddedResult = web3.eth.abi.decodeParameters(
            [
              {
                type: 'string',
                name: 'book',
              },
              {
                type: 'string',
                name: 'chapter',
              },
              {
                type: 'string',
                name: 'verse',
              },
            ],
            e.data
          );

          if (!decoded || !decoded.book || !decoded.chapter || !decoded.verse) {
            console.log(
              'Requisite value(s) missing in LogVerseAdded event data'
            );
          }

          new UpdateVerse().init(decoded.book, decoded.chapter, decoded.verse);
        } catch (e) {
          console.log('decode error:', e);
        }
      })
      .on('error', (error: any) => {
        console.log('bibleContractSubscription subscription error:', error);
      })
      .on('end', (e: any) => {
        console.log('bibleContractSubscription websocket closed:', e);

        this.unsubscribeListeners();

        this.reconnectToWebsocket();
      });
  };

  public unsubscribeListeners = () => {
    if (this.bibleContractSubscription) {
      try {
        this.bibleContractSubscription.unsubscribe((error: any, _: any) => {
          if (error) {
            console.log('bibleContractSubscription ubsub error:', error);
          }

          console.log('bibleContractSubscription unsubscribed');
        });
      } catch (e) {
        console.log('bibleContractSubscription unsubscribe error:', e);
      }
    }

    if (this.newBlockHeadersSubscription) {
      try {
        this.newBlockHeadersSubscription.unsubscribe((error: any, _: any) => {
          if (error) {
            console.log('newBlockHeaders ubsub error:', error);
          }

          console.log('newBlockHeaders unsubscribed');
        });
      } catch (e) {
        console.log('newBlockHeaders unsubscribe error:', e);
      }
    }
  };

  public reconnectToWebsocket = () => {
    setTimeout(() => {
      this.initializeWebsocket();
    }, 2000);
  };
}

export default Infura;
