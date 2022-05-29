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
    Image
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';



export default function Chains() {

    const [chains, setChains] = useState(null);

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
        //return json;
        setChains(json.result)
        console.log(json.result);
    }

    useEffect(() => {
        const chainData = getChains();
        console.log(chainData);

        return () => {
            console.log("This will be logged on unmount");
        }
    }, [])

    return (
        <Menu>
            <MenuButton as={Button} >
                Sending chains
            </MenuButton>
            <MenuList>
                {(chains) ?
                    chains.map((chain) => {
                        return <MenuItem minH='48px'>
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
                    : <div> hi</div>}


            </MenuList>

            <MenuButton as={Button} >
                Receiving chains
            </MenuButton>
            <MenuList>
                {(chains) ?
                    chains.map((chain) => {
                        return <MenuItem minH='48px'>
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
                    : <div> hi</div>}


            </MenuList>
        </Menu>
    )
}