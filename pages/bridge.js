import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, GridItem, Heading, Input, InputGroup, InputRightElement, Table, Tbody, Td, Tr } from '@chakra-ui/react'
import Chains from '../components/Chains'
import Navbar from './components/Navbar'
import FromTokenList from '../components/FromTokenList';
import ToTokenList from '../components/ToTokenList';
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
    const [buttonStatus, setButtonStatus] = useState('Proceed');

    useEffect(() => {
        if (walletAddress && sourceChainId && destinationChainId && fromTokenAddress && toTokenAddress && sendingAmount) {
            getQuote()
        }
    }, [walletAddress, sourceChainId, fromTokenAddress, destinationChainId, toTokenAddress, sendingAmount])

    const getQuote = async () => {
        const amount = ethers.utils.parseUnits(`${sendingAmount}`, fromTokenDecimal);
        const response = await fetch(`https://api.socket.tech/v2/quote?fromChainId=${sourceChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=${destinationChainId}&toTokenAddress=${toTokenAddress}&fromAmount=${amount.toString()}&userAddress=${walletAddress}&uniqueRoutesPerBridge=${uniqueRoutesPerBridge}&sort=${sort}&singleTxOnly=${singleTxOnly}`, {
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
            setQuote(json.result.routes);
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
                'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c', // public api key
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        return json;
    }

    const getTxData = async (route) => {
        const response = await fetch('https://api.socket.tech/v2/build-tx', {
            method: 'POST',
            headers: {
                'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c', // public api key
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "route": route })
        });

        const json = await response.json();
        return json;
    }

    async function getBridgeStatus(transactionHash, fromChainId, toChainId) {
        const response = await fetch(`https://api.socket.tech/v2/bridge-status?transactionHash=${transactionHash}&fromChainId=${fromChainId}&toChainId=${toChainId}`, {
            method: 'GET',
            headers: {
                'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c', '645b2c8c-5825-4930-baf3-d9b997fcd88c'
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();
        return json;
    }

    const bridgeFunds = async () => {
        if (quote) {
            const route = quote[0];

            if (route.userTxs[0].approvalData != null) {
                const { allowanceTarget, approvalTokenAddress, minimumApprovalAmount, owner } = route.userTxs[0].approvalData;

                const allowance = await checkAllowance(sourceChainId, owner, allowanceTarget, approvalTokenAddress);

                const allowanceValue = allowance.result?.value;

                if (minimumApprovalAmount > allowanceValue) {
                    // Approval tx data fetched
                    const approvalTransactionData = await getApprovalTransactionData(sourceChainId, owner, allowanceTarget, approvalTokenAddress, minimumApprovalAmount);
                    console.log(approvalTransactionData.result?.to);
                    const gasPrice = await provider.getGasPrice();
                    console.log(approvalTransactionData.result?.from, signer.address)

                    const tx = await provider.getSigner().sendTransaction({
                        from: signer.address,
                        to: approvalTransactionData.result?.to,
                        value: '0x00',
                        data: approvalTransactionData.result?.data,
                        gasPrice: gasPrice,
                        gasLimit: 100000
                    });

                    // Initiates approval transaction on user's frontend which user has to sign
                    const receipt = await tx.wait();

                    console.log('Approval Transaction Hash :', receipt.transactionHash);
                }
            }

            const apiReturnData = await getTxData(route);

            const gasPrice = await signer.getGasPrice();

            const tx = await signer.sendTransaction({
                from: signer.address,
                to: apiReturnData.result.txTarget,
                data: apiReturnData.result.txData,
                value: apiReturnData.result.value,
                gasPrice: gasPrice,
                gasLimit: 200000
            });

            // Initiates swap/bridge transaction on user's frontend which user has to sign
            await tx.wait();

            const txHash = receipt.transactionHash;

            console.log('Bridging Transaction : ', receipt.transactionHash);

            setInterval(() => {
                getBridgeStatus(receipt.transactionHash, sourceChainId, destinationChainId);
            }, 5000)
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
            <Container maxW='2xl' centerContent>
                <div>
                    <Heading size={'sm'}>Send</Heading>
                    <Grid templateColumns={'repeat(6, 1fr)'}>
                        <GridItem colSpan={3}>
                            <Input focusBorderColor={'white.900'} placeholder='Enter Amount' onChange={(e) => { setSendingAmount(parseInt(e.target.value, 10)) }}></Input>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <FromTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setFromTokenAddress={setFromTokenAddress} setFromTokenDecimal={setFromTokenDecimal} />
                        </GridItem>
                    </Grid>
                </div>
                <br />
                <div>
                    <Heading size={'sm'}>Receive</Heading>
                    <Grid templateColumns={'repeat(6, 1fr)'}>
                        <GridItem colSpan={3}>
                            <Input readOnly focusBorderColor={'white.900'} placeholder='Enter Amount' value={quote && (ethers.utils.formatUnits(ethers.BigNumber.from(quote[0]?.toAmount, toTokenDecimal)))} onChange={(e) => { setReceivingAmount(e.target.value) }}></Input>

                        </GridItem>
                        <GridItem colSpan={2}>
                            <ToTokenList sourceChainId={sourceChainId} destinationChainId={destinationChainId} setToTokenAddress={setToTokenAddress} setToTokenDecimal={setToTokenDecimal} />

                        </GridItem>
                    </Grid><br />
                </div>

                <Box className='greyBox' w={'75%'}>
                    <Table colorScheme='whiteAlpha'>
                        <Tbody>
                            <Tr>
                                <Td>Bridge Name</Td>
                                <Td > {quote && quote[0]?.usedBridgeNames[0]} </Td>
                            </Tr>
                            <Tr>
                                <Td>Gas Fee</Td>
                                <Td >$ {quote && quote[0]?.totalGasFeesInUsd}</Td>
                            </Tr>
                        </Tbody>

                    </Table>
                </Box>


                <Button colorScheme='teal' size='sm' onClick={bridgeFunds}>
                    Proceed
                </Button>



            </Container>


        </div >
    );
}