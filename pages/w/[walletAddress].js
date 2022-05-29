import { Avatar, Button, Grid, GridItem, Heading, Text, Wrap, WrapItem } from '@chakra-ui/react';

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

import Link from 'next/link'
import Head from 'next/head'
import Search from '../components/Search';
import Footer from '../components/Footer';


const ethers = require('ethers');



export default function PublicPage() {
    const [ethAddress, setEthAddress] = useState('')
    const [ensAddress, setENSAddress] = useState('')
    const [copyMessage, setCopyMessage] = useState('Copy')
    const [pfpURL, setPFPURL] = useState('https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX40526738.jpg')
    const router = useRouter()
    const { walletAddress } = router.query

    const getProvider = async () => {
        const RPC = 'https://rpc.ankr.com/eth';
        return new ethers.providers.StaticJsonRpcProvider(RPC);
    }

    const getENSDetails = async (ens) => {
        const provider = await getProvider();
        const address = await provider.resolveName(ens);
        const profile = await provider.getAvatar(ens);
        (profile) ? setPFPURL(profile) : null;
        setENSAddress(ens);
        setEthAddress(address)
    }


    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    }
    useEffect(() => {
        if (walletAddress && walletAddress.endsWith('.eth')) {

            getENSDetails(walletAddress);
        } else if (walletAddress && walletAddress.startsWith('0x')) {

            setEthAddress(walletAddress);
        }
    })





    return (
        <div className='body'>
            <Head>
                <title>{ensAddress ? ensAddress : `${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)}`} | Hamsa</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <main>
                <Grid templateColumns='repeat(5, 1fr)' gap={6} mb={12}>
                    <GridItem>
                        <Link href="/" ><Heading className='btn-link'>Hamsa</Heading></Link>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <Search root='' />
                    </GridItem>
                </Grid>

                <Grid templateColumns='repeat(5, 1fr)' gap={6}>
                    <GridItem >
                        <Avatar size='xl' src={pfpURL}></Avatar>
                        <br />
                        <br />
                        {(ensAddress || ethAddress) ? (
                            <div>


                                <Heading>{(ensAddress ? ensAddress : `${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)}`)}</Heading>
                                <Text>{(ensAddress ? `${ethAddress.slice(0, 4)}...${ethAddress.slice(-4)}` : '')}</Text>
                            </div>
                        ) : <Heading>Loading...</Heading>}
                        <br />
                        <Wrap>
                            <WrapItem>
                                <Button onClick={() => { copyToClipboard(ethAddress); setCopyMessage('Copied!'); setTimeout(() => setCopyMessage('Copy'), 3000); }}>{copyMessage}</Button>

                            </WrapItem>
                            <WrapItem>
                                <a href={`https://etherscan.io/address/${ethAddress}`} target="_blank" rel="noopener noreferrer">
                                    <Button>View on Etherscan⤴</Button>
                                </a>

                            </WrapItem>
                        </Wrap>


                    </GridItem>
                    <GridItem colSpan={4}>

                        {(ensAddress || ethAddress) ? (
                            <Heading>{(ensAddress ? ensAddress : `${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)}`)}'s Recent Activity</Heading>
                        ) : <Heading>Loading...</Heading>}
                    </GridItem>
                </Grid>
            </main>
            <Footer />
        </div>
    );
}