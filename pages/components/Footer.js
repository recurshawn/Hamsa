import styles from '../../styles/Home.module.css'
import { Heading } from '@chakra-ui/react'

export default function () {
    return (
        <footer className={styles.footer}>
            <Heading as='h6' size={'m'}>Built with no sleep by <a href="https://twitter.com/shreykeny">Shrey</a> & <a href="https://shawn.app">Shawn</a></Heading>
        </footer>
    )
}