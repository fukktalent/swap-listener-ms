import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils'

import Erc20Abi from '../../abi/Erc20Abi';

export async function getTicker(
  contract: Contract,
  web3: Web3
): Promise<string> {
  const token0 = await contract.methods.token0().call();
  const token1 = await contract.methods.token1().call();

  const symbol0 = await new web3.eth.Contract(Erc20Abi as AbiItem[], token0)
    .methods.symbol().call();
  const symbol1 = await new web3.eth.Contract(Erc20Abi as AbiItem[], token1)
    .methods.symbol().call();

  return symbol0 + symbol1;
}
