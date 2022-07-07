import {
   Box,
   Container,
   SimpleGrid,
   Stack,
   Heading,
   Button,
   Text,
   Image,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import React from 'react'

const UnauthenticatedUserView = () => {
   return (
      <Box position={'relative'}>
         <Container
            as={SimpleGrid}
            maxW={'7xl'}
            columns={{ base: 1, md: 2 }}
            p={{ base: 4, sm: 5, lg: 32 }}
         >
            <Stack spacing={[5, 20]}>
               <Heading
                  lineHeight={1.1}
                  fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
               >
                  Connect Web3 Builders so the{' '}
                  <Text
                     as={'span'}
                     bgGradient="linear(to-r, red.400,pink.400)"
                     bgClip="text"
                  >
                     Revolution
                  </Text>{' '}
                  Happens Faster
               </Heading>
               <Box w="300px">
                  <Image
                     src="/profile_example.png"
                     height="396px"
                     width="300px"
                     alt="inner circle profile"
                  />
               </Box>
            </Stack>
            <Stack
               bg={'gray.50'}
               rounded={'xl'}
               p={[4, 6, 8]}
               maxW={{ lg: 'lg' }}
            >
               <Stack spacing={4}>
                  <Heading
                     color={'gray.800'}
                     lineHeight={1.1}
                     fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                  >
                     <Text
                        as={'span'}
                        bgGradient="linear(to-r, red.400,pink.400)"
                        bgClip="text"
                     >
                        Join the Party!
                     </Text>
                  </Heading>
                  <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                     Claim your all-in-one place web3 online profile, tell your
                     story, and connect with an amazing network of the web3
                     buiders.
                  </Text>
               </Stack>
               <Button
                  fontFamily={'heading'}
                  mt={3}
                  w={'full'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={'white'}
                  _hover={{
                     bgGradient: 'linear(to-r, red.400,pink.400)',
                     boxShadow: 'xl',
                  }}
                  onClick={() => signIn()}
               >
                  Get Started!
               </Button>
            </Stack>
         </Container>
      </Box>
   )
}

export default UnauthenticatedUserView
