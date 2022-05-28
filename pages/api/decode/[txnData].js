const ethers = require('ethers');
const InputDataDecoder = require('ethereum-input-data-decoder');

const contractABIs = require('./contracts.json')

export default function handler(req, res) {
  const { txnData } = req.query


  const RPC = 'https://rpc.ankr.com/eth';
  const HASH = '0x671fdd8162051faf80259348041576cdebb3cfe4e96cb68a4792f3c11eb5e85f'

  const getProvider = async () => {
    return new ethers.providers.StaticJsonRpcProvider(RPC);
  }

  const getTransactionReceiptFromHash = async (transactionHash) => {
    const provider = await getProvider();
    const receipt = await provider.getTransaction(transactionHash);
    return receipt;
  }

  const startDecoding = async () => {
    const receipt = await getTransactionReceiptFromHash(HASH);
    const toAddress = receipt.to;
    const data = receipt.data;

    if (toAddress === '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D') {
      console.log('Uniswap V2 Transaction \n');
      
      const decoder = new InputDataDecoder(contractABIs[toAddress].abi);

      const decodedData = decoder.decodeData(data);

      console.log(decodedData);
    }
  }

   startDecoding();

  // const resp = await startDecoding();
  //
  res.status(200).json({ txn: 'hi' })
}