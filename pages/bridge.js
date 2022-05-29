import { useRouter } from 'next/router'
import { useState } from 'react';
import { Box, Button, Container, Heading, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
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
    const [receivingAmount, setReceivingAmount] = useState();
    const uniqueRoutesPerBridge = true;
    const sort = 'output';
    const singleTxOnly = true;

    const getQuote = async () => {
        console.log(walletAddress, sourceChainId, fromTokenAddress, destinationChainId, toTokenAddress, sendingAmount);

        if (walletAddress && sourceChainId && destinationChainId && fromTokenAddress && toTokenAddress && sendingAmount) {
            const response = await fetch(`https://api.socket.tech/v2/quote?fromChainId=${sourceChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=${destinationChainId}&toTokenAddress=${toTokenAddress}&fromAmount=${sendingAmount}&userAddress=${walletAddress}&uniqueRoutesPerBridge=${uniqueRoutesPerBridge}&sort=${sort}&singleTxOnly=${singleTxOnly}`, {
                method: 'GET',
                headers: {
                    'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();
            console.log(json)
            return json;
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
            </Container>
            <Container maxW='2xl'>


                <Heading size={'sm'}>Send</Heading>
                <InputGroup>
                    <Input focusBorderColor={'white.900'} placeholder='Enter Amount' onChange={(e) => { setSendingAmount(e.target.value) }}></Input>
                    <InputRightElement width='9rem'>
                        <FromTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setFromTokenAddress={setFromTokenAddress} />
                    </InputRightElement>
                </InputGroup>

                <br />
                <Heading size={'sm'}>Receive</Heading>
                <InputGroup>
                    <Input focusBorderColor={'white.900'} placeholder='Enter Amount'onChange={(e) => { setReceivingAmount(e.target.value) }}></Input>
                    <InputRightElement width='9rem'>
                        <ToTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setToTokenAddress={setToTokenAddress} />
                    </InputRightElement>
                </InputGroup>



            
                <Button colorScheme='teal' size='sm' onClick={getQuote}>
                    Button
                </Button>
            </Container>
        </div >
    );
}