import React, { useState } from "react";
import Link from "next/link";
import {
  IconButton,
  Input,
  Tooltip,
  useToast,
  Spinner,
  useDisclosure,
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { SiDiscord } from "react-icons/si";
import { useSession, signIn, signOut } from "next-auth/react";

const Header: React.FC = (props) => {
  const { data: session, status } = useSession();
  console.log("session: ", session);
  console.log("status: ", status);

  const toast = useToast();
  const [isSubscriptionFormOpen, setIsSubscriptionFormOpen] = useState(false);
  const toggleSubscriptionFormOpen = () => {
    setIsSubscriptionFormOpen(!isSubscriptionFormOpen);
  };
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("Session: ", session);

  if (status === "loading") {
    return <h1>Loading</h1>;
  }
  return (
    <Flex direction={"column"}>
      <Flex justifyContent="center" bg="cyan.500" color="white">
        <Flex
          as="nav"
          direction={"row"}
          justifyContent="space-between"
          // wrap="wrap"
          padding={4}
          width={"container.lg"}
          {...props}
        >
          {/* <Box maxW="100%"> */}
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={"tighter"}>
              <Link href={"/"}>innerCircle</Link>
            </Heading>
          </Flex>
          {/* <Stack
            direction={{ base: "column", md: "row" }}
            // display={{ base: isOpen ? "block" : "none", md: "flex" }}
            width={{ base: "full", md: "auto" }}
            alignItems="center"
            flexGrow={1}
            mt={{ base: 4, md: 0 }}
          >
            <Link href="/">Join</Link>
            <Link href="/feed">Feed</Link>
          </Stack> */}
          <Box>
            <Tooltip
              label={
                "Join our Discord for product updates, future NFT mints, and hangout!"
              }
            >
              <a
                href={"https://discord.gg/CBr32zf4g7"}
                target={"_blank"}
                rel="noreferrer"
              >
                <IconButton
                  mr={3}
                  colorScheme="cyan.700"
                  aria-label={"Discord"}
                  icon={<SiDiscord size={25} />}
                />
              </a>
            </Tooltip>
          </Box>
          <Box>
            {session ? (
              <Button mx={3} colorScheme={"blue"} onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <Button mx={3} colorScheme={"blue"} onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </Box>
        </Flex>
      </Flex>
      {/* subscription form */}
      <Stack
        direction={"column"}
        bg={"cyan.200"}
        w={"100%"}
        display={isSubscriptionFormOpen ? "block" : "none"}
      >
        <Flex
          direction={"row"}
          justify={"center"}
          w={"100%"}
          p={2}
          alignItems={"center"}
        >
          <Input
            id={"email"}
            type={"email"}
            placeholder={"Your Email"}
            variant={"solid"}
            maxW={"50%"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            aria-label={"Your Email"}
            required
          />
          <Spinner
            display={isLoading ? "block" : "none"}
            position={"absolute"}
            color="blue.500"
            emptyColor="gray.300"
            thickness="3px"
          />
        </Flex>
        <Flex justify={"center"} w="100%" color={"gray.500"}>
          We will never sell your data or spam you 🦄
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Header;
