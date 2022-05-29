const ethers = require('ethers');
const InputDataDecoder = require('ethereum-input-data-decoder');

const contractABIs = require('./contracts.json');

const CMC_API_KEY = process.env.CMC_API_KEY;

import { createClient } from 'urql';

const UNISWAP_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

const query = `
`

const ethToken = {
  tokenName: 'ETH',
  tokenLogo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
};

export default async function handler(req, res) {
  const { txHash } = req.query

  const RPC = 'https://rpc.ankr.com/eth';

  const getProvider = async () => {
    return new ethers.providers.StaticJsonRpcProvider(RPC);
  }

  const getTransactionReceiptFromHash = async (transactionHash) => {
    const provider = await getProvider();
    const receipt = await provider.getTransactionReceipt(transactionHash);
    return receipt;
  }

  const getTokenDetails = async (tokenAddress) => {
    const tokenDetails = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?CMC_PRO_API_KEY=${CMC_API_KEY}&address=${tokenAddress}`);
    const response = await tokenDetails.json();
    if (response.data != null || response.data != undefined) {
      const data = Object.values(response.data)[0];
      return {
        tokenName: data.name,
        tokenLogo: data.logo
      };
    }
    else {
      return {
        tokenName: 'Undefined',
        tokenLogo: 'https://cdn0.iconfinder.com/data/icons/documents-50/32/undefined-document-512.png'
      };
    }
  }

  const convertBigNumberToNumber = (tokenAddress, number) => {
    console.log('Number', number);
    if (tokenAddress == '0xdAC17F958D2ee523a2206206994597C13D831ec7' || tokenAddress == '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') {
      return ethers.utils.formatUnits(number, 6);
    }
    else if (tokenAddress == 'eth') {

      return ethers.utils.formatEther(number);
    }
    else {
      return ethers.utils.formatEther(number);
    }

  }

  const fetchLogsByTopicHash = async (receipt) => {
    return receipt.logs.map(log => console.log(log.topics))
  }

  // const startDecoding = async () => {

  // }

  const startDecoding = async () => {
    const provider = await getProvider();
    const receipt = await getTransactionReceiptFromHash(txHash);
    const toAddress = receipt.to;
    const data = receipt.data;
    const value = receipt.value;

    if (toAddress === '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D') {
      console.log('Uniswap V2 Transaction \n');

      const decoder = new InputDataDecoder(contractABIs[toAddress].abi);

      const decodedData = decoder.decodeData(data);

      console.log(decodedData);


      if (decodedData.method == 'swapExactTokensForTokens') {
        const fromToken = await getTokenDetails(`0x${decodedData.inputs[2][0]}`);
        const toToken = await getTokenDetails(`0x${decodedData.inputs[2][2]}`);

        return `Swapped ${convertBigNumberToNumber(decodedData.inputs[2][0], decodedData.inputs[0])} ${fromToken.tokenName} to ${convertBigNumberToNumber(decodedData.inputs[2][2], decodedData.inputs[1])} ${toToken.tokenName} on Uniswap`
      }

      else if (decodedData.method == 'swapExactETHForTokens') {
        const fromToken = ethToken
        const toToken = await getTokenDetails(`0x${decodedData.inputs[1][1]}`);
        return `Swapped ${convertBigNumberToNumber('eth', value)} ${fromToken.tokenName} to ${convertBigNumberToNumber(decodedData.inputs[2][2], decodedData.inputs[0])} ${toToken.tokenName} on Uniswap`
      }

      else if (decodedData.method == 'addLiquidityETH') {
        const ethToken = ethToken;
        const token2 = await getTokenDetails(`${decodedData.inputs[0]}`);
        return `Added ${convertBigNumberToNumber('eth', value)}  ${ethToken.tokenName} +  ${convertBigNumberToNumber(decodedData.inputs[0], decodedData.inputs[2])}  ${token2.tokenName} liquidity to Uniswap`
      }
    }
  }

  const resp = await startDecoding();

  res.status(200).json({ data: resp })
}