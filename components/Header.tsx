import React, { useState } from 'react'
import Link from 'next/link'
import {
   IconButton,
   Tooltip,
   useToast,
   Spinner,
   Box,
   Heading,
   Flex,
   Button,
} from '@chakra-ui/react'
import { SiDiscord } from 'react-icons/si'
import { BsPersonFill } from 'react-icons/bs'
import { useSession, signIn, signOut } from 'next-auth/react'
import Router from 'next/router'

const Header: React.FC = (props) => {
   const { data: session, status } = useSession()

   const [isLoading, setIsLoading] = useState(false)


   if (status === 'loading') {
      return <h1>Loading</h1>
   }
   return (
      <Flex direction={'column'}>
         <Flex justifyContent="center" bg='blue.300' color="white">
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
               <Flex direction={'row'}>
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
                              colorScheme='blue.300'
                              aria-label={'Discord'}
                              icon={<SiDiscord size={25} />}
                           />
                        </a>
                     </Tooltip>
                  </Box>
                  {session ? (<Box>
                     <Tooltip
                        label={
                           'My Profile'
                        }
                     >
                        <Link href={'/profile/my_profile'}>
                           <IconButton
                              mr={3}
                              colorScheme='blue.300'
                              aria-label={'My Profile'}
                              icon={<BsPersonFill size={25} />}
                           />
                        </Link>
                     </Tooltip>
                  </Box>) : undefined}
                  <Box>
                     {session ? (
                        <Button
                           mx={3}
                           colorScheme={'blue'}
                           onClick={() => signOut({
                              callbackUrl: `${window.location.origin}`
                           })}
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
      </Flex>
   )
}

export default Header
