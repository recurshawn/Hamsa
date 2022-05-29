import styles from '../styles/Home.module.css'
import Head from 'next/head'

import Footer from './components/Footer'
import Search from './components/Search'
import { Heading, Grid, GridItem, Text, Container } from '@chakra-ui/react'
import Link from 'next/link'
export default function Home() {
  return (
    <div className='body'>
      <Head>
        <title>Hamsa</title>
        <meta name="description" content="Wallet Scores" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Grid templateColumns='repeat(5, 1fr)' gap={12} mb={12}>
          <GridItem>
            <Link href="/" ><Heading className='btn-link'>Hamsa</Heading></Link>
          </GridItem>
          <GridItem colSpan={4}>


          </GridItem>
        </Grid>
        <Container maxW='1250px' mb={12}>
          <Grid templateColumns='repeat(2, 1fr)' gap={20}>
            <GridItem>
              <Heading size='lg'>View docs</Heading>
            </GridItem>
            <GridItem>
              <Heading size='lg'>See the API in action</Heading>
              <br />
              <Search root='w/' />
            </GridItem>
            <GridItem>
              <Heading size='lg'>Don't see your contract supported?</Heading>
              <Link href="/add-contract"><Text> Add it!</Text></Link>
            </GridItem>
          </Grid>
        </Container>

      </main>

      <Footer />
    </div>
  )
}
