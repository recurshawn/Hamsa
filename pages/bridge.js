import { useRouter } from 'next/router'
import { useState } from 'react';
import { Button, Container } from '@chakra-ui/react'
import Chains from '../components/Chains'
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
            <div className="topnav">
                <a className="active" href="#home" onClick={requestWallet}>Connect Wallet</a>

                <p> {walletAddress}</p>
            </div>

            <Container maxW='2xl' centerContent>
                <Chains setSourceChainId={setSourceChainId} setDestinationChainId={setDestinationChainId} />
                <FromTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setFromTokenAddress={setFromTokenAddress} />
                <ToTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setToTokenAddress={setToTokenAddress} />
                <SendingAmount setSendingAmount={setSendingAmount} />
                <Button colorScheme='teal' size='sm' onClick={getQuote}>
                    Button
                </Button>
            </Container>
        </div >
    );
}