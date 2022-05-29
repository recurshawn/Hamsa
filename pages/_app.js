
import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return  <ChakraProvider><Component key={router.asPath} {...pageProps} /></ChakraProvider>
}

export default MyApp
