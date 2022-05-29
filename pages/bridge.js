import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Box, Button, Container, Heading, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import Chains from '../components/Chains'
import Navbar from './components/Navbar'
import FromTokenList from '../components/FromTokenList';
import ToTokenList from '../components/ToTokenList';
import SendingAmount from '../components/SendingAmount'
import { ethers } from 'ethers';

export default function PublicPage() {

    const [signer, setSigner] = useState();
    const [provider, setProvider] = useState();

    const [walletAddress, setWalletAddress] = useState();
    const [sourceChainId, setSourceChainId] = useState();
    const [destinationChainId, setDestinationChainId] = useState();
    const [fromTokenAddress, setFromTokenAddress] = useState();
    const [toTokenAddress, setToTokenAddress] = useState();
    const [sendingAmount, setSendingAmount] = useState();
    const [fromTokenDecimal, setFromTokenDecimal] = useState();
    const [toTokenDecimal, setToTokenDecimal] = useState();
    const [connect, setConnect] = useState(false);
    const [quote, setQuote] = useState(null);
    const uniqueRoutesPerBridge = true;
    const sort = 'output';
    const singleTxOnly = true;

    useEffect(() => {
        if (walletAddress && sourceChainId && destinationChainId && fromTokenAddress && toTokenAddress && sendingAmount) {
            getQuote()
        }
    }, [walletAddress, sourceChainId, fromTokenAddress, destinationChainId, toTokenAddress, sendingAmount])

    const getQuote = async () => {
        const response = await fetch(`https://api.socket.tech/v2/quote?fromChainId=${sourceChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=${destinationChainId}&toTokenAddress=${toTokenAddress}&fromAmount=${sendingAmount}&userAddress=${walletAddress}&uniqueRoutesPerBridge=${uniqueRoutesPerBridge}&sort=${sort}&singleTxOnly=${singleTxOnly}`, {
            method: 'GET',
            headers: {
                'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        console.log('jaja', json);
        if (json.result?.routes.length !== 0) {
            setQuote(json.result.routes)
            console.log(json.result);
            return json;
        }
    }

    const checkAllowance = async (chainId, owner, allowanceTarget, tokenAddress) => {
        const response = await fetch(`https://api.socket.tech/v2/approval/check-allowance?chainID=${chainId}&owner=${owner}&allowanceTarget=${allowanceTarget}&tokenAddress=${tokenAddress}`, {
            method: 'GET',
            headers: {
                'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        return json;
    }

    async function getApprovalTransactionData(chainId, owner, allowanceTarget, tokenAddress, amount) {
        const response = await fetch(`https://api.socket.tech/v2/approval/build-tx?chainID=${chainId}&owner=${owner}&allowanceTarget=${allowanceTarget}&tokenAddress=${tokenAddress}&amount=${amount}`, {
            method: 'GET',
            headers: {
                'API-KEY': API_KEY,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        return json;
    }

    const getTxData = async () => {

    }

    const getBridgeStatus = async () => {

    }

    const bridgeFunds = async () => {
        if (quote) {
            const route = quote[0];

            const { allowanceTarget, approvalTokenAddress, minimumApprovalAmount, owner } = route.userTxs[0].approvalData;

            const allowance = await checkAllowance(sourceChainId, owner, allowanceTarget, approvalTokenAddress);

            const allowanceValue = allowance.result?.value;

            if (minimumApprovalAmount > allowanceValue) {
                // Approval tx data fetched
                const approvalTransactionData = await getApprovalTransactionData(sourceChainId, owner, allowanceTarget, approvalTokenAddress, minimumApprovalAmount);

                const gasPrice = await provider.getGasPrice();

                const gasEstimate = await provider.estimateGas({
                    from: signer.address,
                    to: approvalTransactionData.result?.to,
                    value: '0x00',
                    data: approvalTransactionData.result?.data,
                    gasPrice: gasPrice
                });

                const tx = await signer.sendTransaction({
                    from: approvalTransactionData.result?.from,
                    to: approvalTransactionData.result?.to,
                    value: '0x00',
                    data: approvalTransactionData.result?.data,
                    gasPrice: gasPrice,
                    gasLimit: gasEstimate
                });

                // Initiates approval transaction on user's frontend which user has to sign
                const receipt = await tx.wait();

                console.log('Approval Transaction Hash :', receipt.transactionHash);
            }
        }
    }

    const requestWallet = async () => {
        if (window.ethereum) {
            console.log('Web3 wallet detected');
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
                // Prompt user for account connections
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                setSigner(signer);
                setProvider(provider);
                setWalletAddress(await signer.getAddress());
            }
            catch (e) {
                console.log('Error', e);
            }
        }
        else {
            alert('No wallet detected. Please download a web3 wallet on a supported browser');
        }
    }

    useEffect(() => {
        requestWallet();
    }, [connect])


    return (
        <div>

            <Navbar connectWallet={() => setConnect(true)} walletAddress={walletAddress} />

            <Container maxW='2xl' centerContent>
                <Chains setSourceChainId={setSourceChainId} setDestinationChainId={setDestinationChainId} />
            </Container>
            <Container maxW='2xl'>

                <Heading size={'sm'}>Send</Heading>
                <InputGroup>
                    <Input focusBorderColor={'white.900'} placeholder='Enter Amount' onChange={(e) => { setSendingAmount(parseInt(e.target.value, 10)) }}></Input>
                    <InputRightElement width='9rem'>
                        <FromTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setFromTokenAddress={setFromTokenAddress} setFromTokenDecimal={setFromTokenDecimal} />
                    </InputRightElement>
                </InputGroup>

                <br />
                <Heading size={'sm'}>Receive</Heading>
                <InputGroup>
                    <Input focusBorderColor={'white.900'} placeholder='Enter Amount' onChange={(e) => { setReceivingAmount(parseInt(e.target.value, 10)) }}></Input>
                    <InputRightElement width='9rem'>
                        <ToTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setToTokenAddress={setToTokenAddress} setToTokenDecimal={setToTokenDecimal} />
                    </InputRightElement>
                </InputGroup>


                <Button colorScheme='teal' size='sm' onClick={bridgeFunds}>
                    Proceed
                </Button>
            </Container>
        </div >
    );
}