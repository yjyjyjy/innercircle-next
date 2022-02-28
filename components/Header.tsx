import React, { useState } from "react";
import Link from "next/link";
import { IconButton, Input, Tooltip, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { SiDiscord } from "react-icons/si";

import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  useDisclosure
} from "@chakra-ui/react";

const Header = (props) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const handleToggle = () => (isOpen ? onClose() : onOpen());
  const [isSubscriptionFormOpen, setIsSubscriptionFormOpen] = useState(false);
  const toggleSubscriptionFormOpen = () => {
    setIsSubscriptionFormOpen(!isSubscriptionFormOpen)
  }
  const [email, setEmail] = useState('')

  const handleSubscribe = async () => {
    console.log(email)
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      console.log('success')
    } else {
      const data = await response.json()
      console.log(data)
    }
  }

  return (
    <Flex direction={'column'}>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={4}
        bg="cyan.500"
        color="white"
        {...props}
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"tighter"}>
            <Link href={'/'}>
              innerCircle
            </Link>
          </Heading>
        </Flex>

        {/* <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <GiHamburgerMenu />
      </Box>

      <Stack
        direction={{ base: "column", md: "row" }}
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
      >
        <Text>Docs</Text>
        <Text>Examples</Text>
        <Text>Blog</Text>
      </Stack> */}

        <Box
        // display={{ base: isOpen ? "block" : "none", md: "block" }}
        // mt={{ base: 4, md: 0 }}
        >
          <Tooltip label={'Join our Discord for product updates, future NFT mints, and hangout!'}>
            <a href={"https://discord.gg/CBr32zf4g7"} target={"_blank"} rel="noreferrer">
              <IconButton
                mr={3}
                colorScheme='cyan.700'
                aria-label={'Discord'}
                icon={<SiDiscord size={25} />}
              />
            </a>
          </Tooltip>
          <Tooltip label={'Get an email notification when there is a new project invested by smart money investors'}>
            <Button
              colorScheme="cyan.700"
              variant="outline"
              _hover={{ bg: "cyan.700", borderColor: "cyan.700" }}
              onClick={toggleSubscriptionFormOpen}
            >
              Get Newsletter
            </Button>
          </Tooltip>

        </Box>

      </Flex>
      <Stack
        direction={'column'}
        bg={'cyan.200'}
        w={"100%"}
        display={isSubscriptionFormOpen ? 'block' : "none"}
      >
        <Flex
          direction={'row'}
          justify={'center'}
          w={"100%"}

          p={2}
        >
          <Input
            id={'email'}
            type={'email'}
            placeholder={'Your Email'}
            variant={'solid'}
            maxW={'50%'}
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            aria-label={'Your Email'}
            required
          />
          <Button mx={3} colorScheme={'blue'} onClick={handleSubscribe}>Subscribe</Button>
        </Flex>
        <Flex justify={'center'} w='100%' color={'gray.500'}>We will never sell your data or spam you 🦄</Flex>
      </Stack>
    </Flex>
  );
};

export default Header;
