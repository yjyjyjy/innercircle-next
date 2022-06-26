import React, { useState } from 'react'
import NextLink from 'next/link'
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
   Avatar,
   Link,
   Text,
   Stack,
   Collapse,
   Icon,
   Popover,
   PopoverTrigger,
   PopoverContent,
   useColorModeValue,
   useBreakpointValue,
   useDisclosure,
   Menu,
   MenuList,
   MenuItem,
   MenuButton,
   AvatarBadge,
} from '@chakra-ui/react'
import { SiDiscord } from 'react-icons/si'
import { BsPersonFill } from 'react-icons/bs'
import { useSession, signIn, signOut } from 'next-auth/react'

import {
   HamburgerIcon,
   CloseIcon,
   ChevronDownIcon,
   ChevronRightIcon,
} from '@chakra-ui/icons'
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic'



import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'




const ConnectButton = () => {

   const { data: wagmiData } = useAccount()
   const { connect } = useConnect({
      connector: new InjectedConnector(),
   })
   const { disconnect } = useDisconnect()
   return (
      <>
         {wagmiData ?
            <Box>
               Connected to {wagmiData.address}
               <Button onClick={() => disconnect()}>Disconnect</Button>
            </Box>
            : <Button onClick={() => connect()}>Connect Wallet</Button>
         }
      </>
   )
}
export default ConnectButton

