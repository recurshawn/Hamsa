import { useRouter } from 'next/router'
import { useState } from 'react';
import { Container } from '@chakra-ui/react'
import Chains from '../components/Chains'
import FromTokenList from '../components/FromTokenList';
import ToTokenList from '../components/ToTokenList';


export default function PublicPage() {

    const [walletAddress, setWalletAddress] = useState();
    const [sourceChainId, setSourceChainId] = useState();
    const [destinationChainId, setDestinationChainId] = useState();

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
            alert('No wallet supported');
        }
    }

    return (
        <div>
            <div className="topnav">
                <a className="active" href="#home" onClick={requestWallet}>Connect Wallet</a>

                <p> {walletAddress}</p>
            </div>

            <Container maxW='2xl' bg='blue.600' centerContent>
                <Chains setSourceChainId={setSourceChainId} setDestinationChainId={setDestinationChainId} />
                <FromTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} />
                <ToTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} />
            </Container>
        </div >
    );
}