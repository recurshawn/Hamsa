import { useRouter } from 'next/router'
import { useState } from 'react';
import { Container } from '@chakra-ui/react'
import Chains from '../components/Chains'


export default function PublicPage() {

    const [walletAddress, setWalletAddress] = useState();

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
                <Chains />
            </Container>
        </div >
    );
}