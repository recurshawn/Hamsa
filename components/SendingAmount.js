import { Input } from '@chakra-ui/react'

export default function SendingAmount({ setSendingAmount }) {
    return (
        <div>
            <Input type='number' placeholder='Enter Amount' onChange={(e) => { setSendingAmount(e.target.value) }} />
        </div>
    )
};
