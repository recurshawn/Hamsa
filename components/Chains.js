import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
    ChevronDownIcon,
    Image,
    HStack,
    Text,
    Heading,
    Grid,
    GridItem,
    Center,
    Box,
    Input,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import FromTokenList from './FromTokenList';
import ToTokenList from './ToTokenList';

export default function Chains({ setSourceChainId, setDestinationChainId }) {

    const [chains, setChains] = useState(null);
    const [activeFromChain, setActiveFromChain] = useState({});
    const [activeToChain, setActiveToChain] = useState({});

    async function getChains() {

        const chains = await fetch('https://api.socket.tech/v2/supported/chains', {
            method: 'GET',
            headers: {
                'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        const json = await chains.json();

        setChains(json.result)
        setActiveFromChain(json.result[0])
        setSourceChainId(json.result[0].chainId)

        setActiveToChain(json.result[1])
        setDestinationChainId(json.result[1].chainId)

        console.log(json.result);
    }

    useEffect(() => {
        getChains();

    }, [])

    return (
        <>
            <Box className='card-bridge'>
                <Grid templateColumns='repeat(5, 1fr)' gap={1}>

                    <GridItem colSpan={2}>
                        <Heading size='sm'>Send from:</Heading>
                    </GridItem>
                    <GridItem>

                    </GridItem>
                    <GridItem colSpan={2}>
                        <Heading size='sm'>Receive on:</Heading>

                    </GridItem>
                    <GridItem colSpan={2}>
                        <Menu>
                            <MenuButton as={Button} >

                                {(activeFromChain) ? <HStack spacing={0}><Image

                                    borderRadius='full'
                                    src={activeFromChain.icon}
                                    alt={activeFromChain.name}
                                    mr='12px'
                                /> <span>{activeFromChain.name}</span></HStack> : 'Loading...'}
                            </MenuButton>
                            <MenuList>
                                {(chains) ?
                                    chains.map((chain) => {
                                        return <MenuItem minH='48px' key={chain.chainId} onClick={() => { setActiveFromChain(chain); setSourceChainId(chain.chainId) }}>
                                            <Image
                                                boxSize='2rem'
                                                borderRadius='full'
                                                src={chain.icon}
                                                alt={chain.name}
                                                mr='12px'
                                            />
                                            <span>{chain.name}</span>
                                        </MenuItem>
                                    })
                                    : <div> </div>}
                            </MenuList>
                        </Menu>
                    </GridItem>
                    <GridItem py='2'>
                        <Center>
                            <ArrowForwardIcon />
                        </Center>


                    </GridItem>
                    <GridItem colSpan={2}>
                        <Menu>
                            <MenuButton as={Button} >
                                {(activeToChain) ? <HStack spacing={0}><Image

                                    borderRadius='full'
                                    src={activeToChain.icon}
                                    alt={activeToChain.name}
                                    mr='12px'
                                /> <span>{activeToChain.name}</span></HStack> : 'Loading...'}
                            </MenuButton>
                            <MenuList>
                                {(chains) ?
                                    chains.map((chain) => {
                                        return <MenuItem minH='48px' key={chain.chainId} onClick={() => { setActiveToChain(chain); setDestinationChainId(chain.chainId) }}>
                                            <Image
                                                boxSize='2rem'
                                                borderRadius='full'
                                                src={chain.icon}
                                                alt={chain.name}
                                                mr='12px'
                                            />
                                            <span>{chain.name}</span>
                                        </MenuItem>
                                    })
                                    : <div> </div>}


                            </MenuList>
                        </Menu>
                    </GridItem>
                </Grid>
                <br />
              
                {/* <Grid>
                <GridItem>

                </GridItem>
                <GridItem>
                    
                    </GridItem>
            </Grid> */}
            </Box>
        </>
    )
}