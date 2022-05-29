import {Input, InputGroup, InputLeftElement} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router'

export default function({root}) {
    const router = useRouter()

    const onSearch = (e) => {
        e.preventDefault();
        router.push(`${root}${e.target.address.value}`)
    }

    return( <form onSubmit={(e) => onSearch(e)}>
    <InputGroup >
        <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.500' />}
        />
        <Input name='address' placeholder={'Search any Ethereum address or ENS name'} bgColor={'gray.200'}></Input>
    </InputGroup>
</form>)
}