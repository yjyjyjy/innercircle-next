import React, { useState } from 'react'
// import Link from 'next/link'
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
} from '@chakra-ui/react'
import { SiDiscord } from 'react-icons/si'
import { BsPersonFill } from 'react-icons/bs'
import { useSession, signIn, signOut } from 'next-auth/react'

import {
   HamburgerIcon,
   CloseIcon,
   ChevronDownIcon,
   ChevronRightIcon,
} from '@chakra-ui/icons';


// const Header: React.FC = (props) => {
//    const { data: session, status } = useSession()
//    const [isDesktop] = useMediaQuery('(min-width: 1290px)')

//    if (status === 'loading') {
//       return <Flex justifyContent="center" bg='blue.300' color="white" position={'fixed'} w='100%' zIndex={888} left={0} right={0}></Flex>
//    }


//    return (
//       <Flex justifyContent="center" bg='blue.300' color="white" position={'fixed'} w='100%' zIndex={888} left={0} right={0}>
//          <Flex
//             direction={'row'}
//             justifyContent="space-between"
//             padding={2}
//             width={'container.xl'}
//             {...props}
//          >
//             <Flex align="center" mr={5} as="nav">
//                <Heading as="h1" size="lg" letterSpacing={'tighter'}>
//                   <Link href={'/'}>innerCircle</Link>
//                </Heading>
//                {session ? <ButtonGroup spacing="1" px={isDesktop ? '50px' : '0'} >
//                   <Link href={'/'}><Button color='white' colorScheme={'twitter'} fontSize='xl' variant='ghost'>Discover</Button></Link>
//                   <Link href={'/network'}><Button color='white' colorScheme={'twitter'} fontSize='xl' variant='ghost'>Network</Button></Link>
//                </ButtonGroup> : undefined}
//             </Flex>
//             <Flex direction={'row'}>
//                <Box>
//                   <Tooltip
//                      label={
//                         'Got opinions on what should be built? Join our Discord! Also, token drop in the future!'
//                      }
//                   >
//                      <a
//                         href={'https://discord.gg/CBr32zf4g7'}
//                         target={'_blank'}
//                         rel="noreferrer"
//                      >
//                         <IconButton
//                            mr={3}
//                            colorScheme='blue.300'
//                            aria-label={'Discord'}
//                            icon={<SiDiscord size={25} />}
//                         />
//                      </a>
//                   </Tooltip>
//                </Box>
//                {session ? (<Box>
//                   <Tooltip
//                      label={
//                         'My Profile'
//                      }
//                   >
//                      <Link href={'/profile/my_profile'}>
//                         <IconButton
//                            mr={3}
//                            colorScheme='blue.300'
//                            aria-label={'My Profile'}
//                            icon={<BsPersonFill size={25} />}
//                         />
//                      </Link>
//                   </Tooltip>
//                </Box>) : undefined}
//                <Box>
//                   {session ? (
//                      <Button
//                         mx={3}
//                         colorScheme={'blue'}
//                         onClick={() => signOut({
//                            callbackUrl: `${window.location.origin}`
//                         })}
//                      >
//                         Sign Out
//                      </Button>
//                   ) : (
//                      <Button
//                         mx={3}
//                         colorScheme={'blue'}
//                         onClick={() => signIn()}
//                      >
//                         Sign On
//                      </Button>
//                   )}
//                </Box>
//             </Flex>
//          </Flex>
//       </Flex >
//    )
// }

// export default Header



export default function Header() {
   const { isOpen, onToggle } = useDisclosure();

   // const { data: session, status } = useSession()
   // const [isDesktop] = useMediaQuery('(min-width: 1290px)')

   // if (status === 'loading') {
   //    return <Flex justifyContent="center" bg='blue.300' color="white" position={'fixed'} w='100%' zIndex={888} left={0} right={0}></Flex>
   // }

   return (
      <Box>
         <Flex
            bg={'gray.800'}
            color={'white'}
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            borderBottom={1}
            borderStyle={'solid'}
            borderColor={'gray.900'}
            align={'center'}
            position={'fixed'}
            zIndex={888}
            w='100%'
         >

            <Flex
               flex={{ base: 1, md: 'auto' }}
               ml={{ base: -2 }}
               display={{ base: 'flex', md: 'none' }}>
               <IconButton
                  onClick={onToggle}
                  icon={
                     isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                  }
                  variant={'ghost'}
                  aria-label={'Toggle Navigation'}
               />
            </Flex>
            <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
               <Text
                  textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                  fontFamily={'heading'}
                  color={'white'}>
                  Logo
               </Text>

               <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                  <DesktopNav />
               </Flex>
            </Flex>

            <Stack
               flex={{ base: 1, md: 0 }}
               justify={'flex-end'}
               direction={'row'}
               spacing={6}>
               <Button
                  as={'a'}
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                  href={'#'}>
                  Sign In
               </Button>
               <Button
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.300'}
                  // href={'#'}
                  _hover={{
                     bg: 'blue.200',
                  }}>
                  Sign Up
               </Button>
            </Stack>
         </Flex>

         <Collapse in={isOpen} animateOpacity>
            <MobileNav />
         </Collapse>
      </Box>
   );
}

const DesktopNav = () => {
   const linkColor = 'gray.200'; // nav
   const linkHoverColor = 'white';
   const popoverContentBgColor = 'gray.800';

   return (
      <Stack direction={'row'} spacing={4}>
         {NAV_ITEMS.map((navItem) => (
            <Box key={navItem.label}>
               <Popover trigger={'hover'} placement={'bottom-start'}>
                  <PopoverTrigger>
                     <Link
                        p={2}
                        href={navItem.href ?? '#'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={linkColor}
                        _hover={{
                           textDecoration: 'none',
                           color: linkHoverColor,
                        }}>
                        {navItem.label}
                     </Link>
                  </PopoverTrigger>

                  {navItem.children && (
                     <PopoverContent
                        border={0}
                        boxShadow={'xl'}
                        bg={popoverContentBgColor}
                        p={4}
                        rounded={'xl'}
                        minW={'sm'}>
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
   );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
   return (
      <Link
         href={href}
         role={'group'}
         display={'block'}
         p={2}
         rounded={'md'}
         _hover={{ bg: 'gray.900' }}>
         <Stack direction={'row'} align={'center'}>
            <Box>
               <Text
                  transition={'all .3s ease'}
                  _groupHover={{ color: 'blue.300' }}
                  fontWeight={500}>
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
               flex={1}>
               <Icon color={'blue.300'} w={5} h={5} as={ChevronRightIcon} />
            </Flex>
         </Stack>
      </Link>
   );
};

const MobileNav = () => {
   return (
      <Stack
         bg={useColorModeValue('white', 'gray.800')}
         p={4}
         display={{ md: 'none' }}>
         {NAV_ITEMS.map((navItem) => (
            <MobileNavItem key={navItem.label} {...navItem} />
         ))}
      </Stack>
   );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
   const { isOpen, onToggle } = useDisclosure();

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
            }}>
            <Text
               fontWeight={600}
               color={useColorModeValue('gray.600', 'gray.200')}>
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

         <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
            <Stack
               mt={2}
               pl={4}
               borderLeft={1}
               borderStyle={'solid'}
               borderColor={useColorModeValue('gray.200', 'gray.700')}
               align={'start'}>
               {children &&
                  children.map((child) => (
                     <Link key={child.label} py={2} href={child.href}>
                        {child.label}
                     </Link>
                  ))}
            </Stack>
         </Collapse>
      </Stack>
   );
};

interface NavItem {
   label: string;
   subLabel?: string;
   children?: Array<NavItem>;
   href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
   {
      label: 'Inspiration',
      children: [
         {
            label: 'Explore Design Work',
            subLabel: 'Trending Design to inspire you',
            href: '#',
         },
         {
            label: 'New & Noteworthy',
            subLabel: 'Up-and-coming Designers',
            href: '#',
         },
      ],
   },
   {
      label: 'Discover',
      href: '/',
   },
   {
      label: 'Network',
      href: '/network',
   },
];