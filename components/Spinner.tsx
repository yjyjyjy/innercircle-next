import { Center } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

function Spinner() {
   return (
      <Center position={'relative'} width="100%" height="90vh">
         <Image
            height={'80px'}
            width={'80px'}
            src="/grid.svg"
            alt="innercricle loader"
         />
      </Center>
   )
}

export default Spinner
