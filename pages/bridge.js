import { useRouter } from 'next/router'
import { useState } from 'react';
import { Container } from '@chakra-ui/react'
import Chains from '../components/Chains'
import Navbar from './components/Navbar'

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
           
            <Navbar connectWallet={requestWallet} walletAddress={walletAddress}/>
            <Container maxW='2xl' centerContent>
                <Chains setSourceChainId={setSourceChainId} setDestinationChainId={setDestinationChainId} />
            </Container>
        </div >
    );
}