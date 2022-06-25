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

export default function Header() {
   const { isOpen, onToggle } = useDisclosure()
   const rounter = useRouter()
   const { data: session, status } = useSession()

   return (
      <Box bg={'gray.800'} position={'fixed'} zIndex={888} w="100%">
         <Flex
            color={'white'}
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4, lg: 200 }}
            borderBottom={1}
            borderStyle={'solid'}
            borderColor={'gray.900'}
            align={'center'}
         >
            <Flex
               flex={{ base: 1, md: 'auto' }}
               ml={{ base: -2 }}
               display={{ base: 'flex', md: 'none' }}
            >
               <IconButton
                  onClick={onToggle}
                  icon={
                     isOpen ? (
                        <CloseIcon w={3} h={3} />
                     ) : (
                        <HamburgerIcon w={5} h={5} />
                     )
                  }
                  variant={'ghost'}
                  aria-label={'Toggle Navigation'}
               />
            </Flex>
            <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
               <NextLink href="/">
                  <Link _hover={{ textDecoration: 'none' }}>
                     <Text
                        textAlign={useBreakpointValue({
                           base: 'center',
                           md: 'left',
                        })}
                        fontFamily={'heading'}
                        color={'white'}
                     >
                        innerCircle
                     </Text>
                  </Link>
               </NextLink>

               <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                  <DesktopNav />
               </Flex>
            </Flex>

            <Stack
               flex={{ base: 1, md: 0 }}
               justify={'flex-end'}
               direction={'row'}
               spacing={1}
            >
               <Tooltip
                  label={
                     'Got opinions on what should be built? Join our Discord! Also, token drop in the future!'
                  }
               >
                  <a
                     href={'https:discord.gg/CBr32zf4g7'}
                     target={'_blank'}
                     rel="noreferrer"
                  >
                     <IconButton
                        mr={3}
                        colorScheme="blue.300"
                        aria-label={'Discord'}
                        icon={<SiDiscord size={25} />}
                     />
                  </a>
               </Tooltip>
               {session ? (
                  <Menu>
                     <MenuButton>
                        <Avatar size={'sm'}>
                           {/* <AvatarBadge borderColor='papayawhip' bg='tomato' boxSize='1.25em' /> */}
                        </Avatar>
                     </MenuButton>
                     <MenuList bg={'gray.800'}>
                        {[
                           {
                              label: 'My Profile',
                              onClick: () => {
                                 rounter.push('/profile/my_profile')
                              },
                           },
                           {
                              label: 'My Conferences',
                              onClick: () => {
                                 rounter.push('/profile/my_conferences')
                              },
                           },
                           {
                              label: 'Sign Out',
                              onClick: () => {
                                 signOut({
                                    callbackUrl: `${window.location.origin}`,
                                 })
                              },
                           },
                        ].map((item) => (
                           <AccountMenuItem
                              key={item.label}
                              onClick={item.onClick}
                              label={item.label}
                           />
                        ))}
                     </MenuList>
                  </Menu>
               ) : (
                  <Button
                     display={{ base: 'none', md: 'inline-flex' }}
                     fontSize={'sm'}
                     fontWeight={600}
                     color={'white'}
                     bg={'blue.300'}
                     onClick={() => signIn()}
                     _hover={{
                        bg: 'blue.200',
                     }}
                  >
                     Sign Up
                  </Button>
               )}
            </Stack>
         </Flex>

         <Collapse in={isOpen} animateOpacity>
            <MobileNav />
         </Collapse>
      </Box>
   )
}

const linkColor = 'gray.200' // nav
const linkHoverColor = 'white'
const popoverContentBgColor = 'gray.800'

const AccountMenuItem = ({ label, onClick }) => {
   return (
      <MenuItem
         bg={popoverContentBgColor}
         _focus={{
            color: linkColor,
            background: 'gray.700',
         }}
         onClick={onClick}
      >
         {label}
      </MenuItem>
   )
}

const DesktopNav = () => {
   return (
      <Stack direction={'row'} spacing={4}>
         {NAV_ITEMS.map((navItem) => (
            <Box key={navItem.label}>
               <Popover trigger={'hover'} placement={'bottom-start'}>
                  <PopoverTrigger>
                     <NextLink href={navItem.href ?? '#'}>
                        <Link
                           p={2}
                           fontSize={'sm'}
                           fontWeight={500}
                           color={linkColor}
                           _hover={{
                              textDecoration: 'none',
                              color: linkHoverColor,
                           }}
                        >
                           {navItem.label}
                        </Link>
                     </NextLink>
                  </PopoverTrigger>

                  {navItem.children && (
                     <PopoverContent
                        border={0}
                        boxShadow={'xl'}
                        bg={popoverContentBgColor}
                        p={4}
                        rounded={'xl'}
                        minW={'sm'}
                     >
                        <Stack>
                           {navItem.children.map((child) => (
                              <DesktopSubNav key={child.label} {...child} />
                           ))}
                        </Stack>
                     </PopoverContent>
                  )}
               </Popover>
            </Box>
         ))}
      </Stack>
   )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
   return (
      <NextLink href={href as string}>
         <Link
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: 'gray.900' }}
         >
            <Stack direction={'row'} align={'center'}>
               <Box>
                  <Text
                     transition={'all .3s ease'}
                     _groupHover={{ color: 'blue.300' }}
                     fontWeight={500}
                  >
                     {label}
                  </Text>
                  <Text fontSize={'sm'}>{subLabel}</Text>
               </Box>
               <Flex
                  transition={'all .3s ease'}
                  transform={'translateX(-10px)'}
                  opacity={0}
                  _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                  justify={'flex-end'}
                  align={'center'}
                  flex={1}
               >
                  <Icon color={'blue.300'} w={5} h={5} as={ChevronRightIcon} />
               </Flex>
            </Stack>
         </Link>
      </NextLink>
   )
}

const MobileNav = () => {
   return (
      <Stack
         bg={'gray.800'}
         // pt={'15px'}
         display={{ md: 'none' }}
      >
         {NAV_ITEMS.map((navItem) => (
            <MobileNavItem key={navItem.label} {...navItem} />
         ))}
      </Stack>
   )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
   const { isOpen, onToggle } = useDisclosure()

   return (
      <Stack spacing={4} onClick={children && onToggle}>
         <Flex
            py={2}
            as={Link}
            href={href ?? '#'}
            justify={'space-between'}
            align={'center'}
            _hover={{
               textDecoration: 'none',
            }}
         >
            <Text fontWeight={600} color={'gray.200'}>
               {label}
            </Text>
            {children && (
               <Icon
                  as={ChevronDownIcon}
                  transition={'all .25s ease-in-out'}
                  transform={isOpen ? 'rotate(180deg)' : ''}
                  w={6}
                  h={6}
               />
            )}
         </Flex>

         <Collapse
            in={isOpen}
            animateOpacity
            style={{ marginTop: '0!important' }}
         >
            <Stack
               mt={2}
               pl={4}
               borderLeft={1}
               borderStyle={'solid'}
               borderColor={'gray.700'}
               align={'start'}
            >
               {children &&
                  children.map((child) => (
                     <Link key={child.label} py={2} href={child.href}>
                        {child.label}
                     </Link>
                  ))}
            </Stack>
         </Collapse>
      </Stack>
   )
}

interface NavItem {
   label: string
   subLabel?: string
   children?: Array<NavItem>
   href?: string
}

const NAV_ITEMS: Array<NavItem> = [
   // {
   //    label: 'Inspiration',
   //    children: [
   //       {
   //          label: 'Explore Design Work',
   //          subLabel: 'Trending Design to inspire you',
   //          href: '#',
   //       },
   //       {
   //          label: 'New & Noteworthy',
   //          subLabel: 'Up-and-coming Designers',
   //          href: '#',
   //       },
   //    ],
   // },
   {
      label: 'Discover',
      href: '/',
   },
   {
      label: 'Network',
      href: '/network',
   },
]
