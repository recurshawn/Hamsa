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
    Menu
} from '@chakra-ui/react'

function TransitionExample({ tokenList, setToTokenAddress }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <Button onClick={onOpen}>Open Modal</Button>
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Menu>
                            {(tokenList) ?
                                tokenList.map(token => {
                                    return <MenuItem minH='48px' key={token.address} onClick={() => { setToTokenAddress(token.address) }}>
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


export default function ToTokenList({ sourceChainId, destinationChainId, setToTokenAddress }) {

    const [tokenList, setTokenList] = useState(null);

    async function getTokenList() {
        const tokenList = await fetch(`https://api.socket.tech/v2/token-lists/to-token-list?fromChainId=${sourceChainId}&toChainId=${destinationChainId}&isShortList=true`, {
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
            <TransitionExample tokenList={tokenList} setToTokenAddress={setToTokenAddress} />
        </div>
    )
}
