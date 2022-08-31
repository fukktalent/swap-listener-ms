import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'
import parseArgs from 'minimist';
import * as dotenv from 'dotenv' 

import { getTicker } from './utils';
import { createMQProducer } from './mq/producer';
import UniswapV3CorePoolAbi from '../abi/UniswapV3Pool';

dotenv.config();

const { NODE_ENDPOINT, AMQP_URL } = process.env;

// get contract address from terminal
const args = parseArgs(process.argv.slice(2), { string: ['address'] });
if (!args.address || !args.queue) {
  console.log('Contract address and queue name are needed');
  process.exit(1);
}

const web3 = new Web3(NODE_ENDPOINT);

const contract: Contract = new web3.eth.Contract(
  UniswapV3CorePoolAbi as AbiItem[],
  args.address
);

let lastBlock: number;
let ticker: string;
let producer;

web3.eth.subscribe('newBlockHeaders')
  .on('connected', async function() {
    lastBlock = await web3.eth.getBlockNumber();
    ticker = await getTicker(contract, web3);
    producer = await createMQProducer(AMQP_URL, args.queue);
    console.log('start block -', lastBlock + 1);
    console.log('ticker - ', ticker);
  })
  .on('data', async function(data) {
    // caught cases when duplicate event
    if (data.number <= lastBlock) return;

    const _lastBlock = lastBlock;
    lastBlock = data.number;

    const events = await contract.getPastEvents(
      'Swap',
      { fromBlock: _lastBlock + 1, toBlock: data.number }
    );

    if (events.length)
      producer(JSON.stringify({ ticker, swapsAmount: events.length }));    
  })
  .on('error', console.error);