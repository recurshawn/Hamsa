import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { Button, Container, Heading, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import Chains from '../components/Chains'
import Navbar from './components/Navbar'
import FromTokenList from '../components/FromTokenList';
import ToTokenList from '../components/ToTokenList';
import SendingAmount from '../components/SendingAmount'

export default function PublicPage() {

    const [walletAddress, setWalletAddress] = useState();
    const [sourceChainId, setSourceChainId] = useState();
    const [destinationChainId, setDestinationChainId] = useState();
    const [fromTokenAddress, setFromTokenAddress] = useState();
    const [toTokenAddress, setToTokenAddress] = useState();
    const [sendingAmount, setSendingAmount] = useState();
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

    const getApproval = async () => {

    }

    const getTxData = async () => {

    }

    const getBridgeStatus = async () => {

    }

    const bridgeFunds = async () => {
        if (quote) {
            const route = quote[0];

        }
    }

    const requestWallet = async () => {
        if (window.ethereum) {
            console.log('Web3 wallet detected');
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0])
            }
            catch (e) {
                console.log('Error', e);
            }
        }
        else {
            alert('No wallet detected. Please download a web3 wallet on a supported browser');
        }
    }

    return (
        <div>

            <Navbar connectWallet={requestWallet} walletAddress={walletAddress} />

            <Container maxW='2xl' centerContent>
                <Chains setSourceChainId={setSourceChainId} setDestinationChainId={setDestinationChainId} />
                <Heading size={'sm'}>Send</Heading>
                <InputGroup>
                    <Input></Input>
                    <InputRightElement width='4.5rem'>
                        <FromTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setFromTokenAddress={setFromTokenAddress} />
                    </InputRightElement>
                </InputGroup>

                <br />
                <Heading size={'sm'}>Receive</Heading>
                <InputGroup>
                    <Input></Input>
                    <InputRightElement width='4.5rem'>
                        <ToTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setToTokenAddress={setToTokenAddress} />
                    </InputRightElement>
                </InputGroup>



                <SendingAmount setSendingAmount={setSendingAmount} />
                <Button colorScheme='teal' size='sm' onClick={bridgeFunds}>
                    Proceed
                </Button>
            </Container>
        </div >
    );
}