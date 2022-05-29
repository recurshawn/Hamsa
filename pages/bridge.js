import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, GridItem, Heading, Input, InputGroup, InputRightElement, Table, Tbody, Td, Tr } from '@chakra-ui/react'
import Chains from '../components/Chains'
import Navbar from './components/Navbar'
import FromTokenList from '../components/FromTokenList';
import ToTokenList from '../components/ToTokenList';

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
            </Container>
            <Container maxW='2xl'>


                <Heading size={'sm'}>Send</Heading>
                <Grid templateColumns={'repeat(6, 1fr)'}>
                    <GridItem colSpan={3}>
                        <Input focusBorderColor={'white.900'} placeholder='Enter Amount' onChange={(e) => { setSendingAmount(e.target.value) }}></Input>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FromTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setFromTokenAddress={setFromTokenAddress} />
                    </GridItem>
                </Grid>
                <br />
                <Heading size={'sm'}>Receive</Heading>
                <Grid templateColumns={'repeat(6, 1fr)'}>
                    <GridItem colSpan={3}>
                        <Input readOnly focusBorderColor={'white.900'} placeholder='Enter Amount' onChange={(e) => { setReceivingAmount(e.target.value) }}></Input>

                    </GridItem>
                    <GridItem colSpan={2}>
                        <ToTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setToTokenAddress={setToTokenAddress} />

                    </GridItem>
                </Grid><br/>
                <Box className='greyBox' w={'75%'}>
                    <Table colorScheme='whiteAlpha'>
            
                        <Tbody>
                            <Tr>
                                <Td>Bridge Name</Td>
                                <Td isNumeric>millimetres (mm)</Td>
                            </Tr>
                            <Tr>
                                <Td>Bridge Fee</Td>
                                <Td isNumeric>centimetres (cm)</Td>
                            </Tr>
                            <Tr>
                                <Td>Gas Fee</Td>
                                <Td isNumeric>metres (m)</Td>
                            </Tr>
                        </Tbody>
           
                    </Table>
                </Box>




                <Button colorScheme='teal' size='sm' onClick={getQuote}>
                    Button
                </Button>
            </Container>
        </div >
    );
}