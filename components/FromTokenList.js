import { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Image,
    MenuItem,
    Menu,
    HStack
} from '@chakra-ui/react'

function TransitionExample({ tokenList, setFromTokenAddress, setFromTokenDecimal }) {
    const [selectedToken, setSelectedToken] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        if (tokenList) {
            setSelectedToken(tokenList[0]);
            setFromTokenAddress(tokenList[0].address)
        }

    }, [tokenList])

    return (
        <>
            {(selectedToken) ? <Button><HStack className='pseudo-btn' spacing={0} onClick={onOpen}> <Image
                boxSize='2rem'
                borderRadius='full'
                src={selectedToken.icon}
                alt={selectedToken.symbol}
                mr='12px'
            />
                <span> {selectedToken.symbol} </span></HStack></Button> : 'Loading...'}
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent className='scrollable'>
                    <ModalHeader>Select Token</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Menu>
                            {(tokenList) ?
                                tokenList.map(token => {
                                    return <MenuItem minH='48px' key={token.address} onClick={() => {
                                        setFromTokenAddress(token.address); setSelectedToken(token); setFromTokenDecimal(token.decimals); onClose();
                                    }}>
                                        <Image
                                            boxSize='2rem'
                                            borderRadius='full'
                                            src={token.icon}
                                            alt={token.symbol}
                                            mr='12px'
                                        />
                                        <span> {token.symbol} </span>
                                    </MenuItem>

                                }) : <div> </div>
                            }
                        </Menu>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default function FromTokenList({ sourceChainId, destinationChainId, setFromTokenAddress, setFromTokenDecimal }) {

    const [tokenList, setTokenList] = useState(null);

    async function getTokenList() {
        const tokenList = await fetch(`https://api.socket.tech/v2/token-lists/from-token-list?fromChainId=${sourceChainId}&toChainId=${destinationChainId}&isShortList=true`, {
            method: 'GET',
            headers: {
                'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        const json = await tokenList.json();
        //return json;
        setTokenList(json.result)

        console.log(json.result);
    }

    useEffect(() => {
        console.log(sourceChainId, destinationChainId)
        getTokenList();

    }, [sourceChainId, destinationChainId]);

    return (
        <div>
            <TransitionExample tokenList={tokenList} setFromTokenAddress={setFromTokenAddress} setFromTokenDecimal={setFromTokenDecimal} />
        </div>
    )
}
