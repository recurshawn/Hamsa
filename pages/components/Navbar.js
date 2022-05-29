
import {
  Box,
  Flex,
  Avatar,
  HStack,
 
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import Link from 'next/link'



export default function withAction({connectWallet, walletAddress}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>{/*bg={useColorModeValue('gray.100', 'gray.900')}*/}
      <Box  px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
         
          <HStack spacing={8} alignItems={'center'}>
            <Link href="/"><Heading className='btn-link'>Hamsa</Heading></Link>
          
          </HStack>
          <Flex alignItems={'center'}>
            <Button
              variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={4}
              onClick={connectWallet}
              >
              {(walletAddress)?`${walletAddress.slice(0,4)}...${walletAddress.slice(-4)}`:'Connect Wallet'}
            </Button>
            
          </Flex>
        </Flex>

        
      </Box>

    </>
  );
}