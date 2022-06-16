import React, { useState } from 'react'
import Link from 'next/link'
import {
   IconButton,
   Tooltip,
   Box,
   Heading,
   Flex,
   Button,
   Container,
   useMediaQuery,
   ButtonGroup,
   Avatar
} from '@chakra-ui/react'
import { SiDiscord } from 'react-icons/si'
import { BsPersonFill } from 'react-icons/bs'
import { useSession, signIn, signOut } from 'next-auth/react'
import { FiMenu } from 'react-icons/fi'

const Header: React.FC = (props) => {
   const { data: session, status } = useSession()
   const [isDesktop] = useMediaQuery('(min-width: 1290px)')

   if (status === 'loading') {
      return <h1>Loading</h1>
   }
   return (
      <Flex justifyContent="center" bg='blue.300' color="white" position={'fixed'} w='100%' zIndex={888} left={0} right={0}>
         <Flex

            direction={'row'}
            justifyContent="space-between"
            padding={2}
            width={'container.xl'}
            {...props}
         >
            <Flex align="center" mr={5} as="nav">
               <Heading as="h1" size="lg" letterSpacing={'tighter'}>
                  <Link href={'/'}>innerCircle</Link>
               </Heading>
               {session ? <ButtonGroup spacing="1" px={isDesktop ? '50px' : '0'} >
                  <Link href={'/'}><Button color='white' colorScheme={'twitter'} fontSize='xl' variant='ghost'>Discover</Button></Link>
                  <Link href={'/network'}><Button color='white' colorScheme={'twitter'} fontSize='xl' variant='ghost'>Network</Button></Link>
               </ButtonGroup> : undefined}
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
                        Sign On
                     </Button>
                  )}
               </Box>
            </Flex>
         </Flex>
      </Flex >
   )
}

export default Header
