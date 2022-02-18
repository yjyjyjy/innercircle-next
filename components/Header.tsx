import React from "react";
import Link from "next/link";
import { Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";

import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  useDisclosure
} from "@chakra-ui/react";

import { GiHamburgerMenu } from "react-icons/gi"

const Header = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleToggle = () => (isOpen ? onClose() : onOpen());

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
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

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
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
        {/* <Text>Docs</Text>
        <Text>Examples</Text>
        <Text>Blog</Text> */}
      </Stack>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Tooltip label={'Join Discord for product updates, future NFT mints, and hangout!'}>
          <a href={"https://discord.gg/CBr32zf4g7"} target={"_blank"} rel="noreferrer">
            <Button
              variant="outline"
              _hover={{ bg: "cyan.700", borderColor: "cyan.700" }}
            >
              Join Discord
            </Button>
          </a>
        </Tooltip>
      </Box>
    </Flex>
  );
};

export default Header;
