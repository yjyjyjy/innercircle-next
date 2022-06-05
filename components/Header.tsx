import React, { useState } from 'react'
import Link from 'next/link'
import {
   IconButton,
   Input,
   Tooltip,
   useToast,
   Spinner,
   Box,
   Stack,
   Heading,
   Flex,
   Button,
} from '@chakra-ui/react'
import { SiDiscord } from 'react-icons/si'
import { useSession, signIn, signOut } from 'next-auth/react'

const Header: React.FC = (props) => {
   const { data: session, status } = useSession()
   const [isSubscriptionFormOpen, setIsSubscriptionFormOpen] = useState(false)
   const [email, setEmail] = useState('')
   const [isLoading, setIsLoading] = useState(false)

   console.log('Session: ', session)

   if (status === 'loading') {
      return <h1>Loading</h1>
   }
   return (
      <Flex direction={'column'}>
         <Flex justifyContent="center" bg="cyan.500" color="white">
            <Flex
               as="nav"
               direction={'row'}
               justifyContent="space-between"
               padding={4}
               width={'container.xl'}
               {...props}
            >
               <Flex align="center" mr={5}>
                  <Heading as="h1" size="lg" letterSpacing={'tighter'}>
                     <Link href={'/'}>innerCircle</Link>
                  </Heading>
               </Flex>
               <Box>
                  <Tooltip
                     label={
                        'Got opinions on what should be built? Join our Discord! Also, token drop in the future!'
                     }
                  >
                     <a
                        href={'https://discord.gg/CBr32zf4g7'}
                        target={'_blank'}
                        rel="noreferrer"
                     >
                        <IconButton
                           mr={3}
                           colorScheme="cyan.700"
                           aria-label={'Discord'}
                           icon={<SiDiscord size={25} />}
                        />
                     </a>
                  </Tooltip>
               </Box>
               <Box>
                  {session ? (
                     <Button
                        mx={3}
                        colorScheme={'blue'}
                        onClick={() => signOut()}
                     >
                        Sign Out
                     </Button>
                  ) : (
                     <Button
                        mx={3}
                        colorScheme={'blue'}
                        onClick={() => signIn()}
                     >
                        Sign In
                     </Button>
                  )}
               </Box>
            </Flex>
         </Flex>
      </Flex>
   )
}

export default Header
