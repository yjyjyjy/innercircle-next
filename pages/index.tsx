import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  SimpleGrid,
  Image,
  Link,
  Flex,
  FormControl,
  Input,
  Center,
  GridItem,
  Grid,
  useMergeRefs,
  useMediaQuery,
} from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Session } from 'next-auth'
import prisma from '../lib/prisma'
import MemberProfileCard, { UserProfileData } from "../components/profile/MemberProfileCard";

export interface ESession extends Session {
  userID: string
}

export async function getServerSideProps(context) {
  const session = (await getSession(context)) as ESession

  // If you haven't logged in, you can't use the tool yet.
  if (!session) {
    return {
      props: {},
    }
  }

  // If userID doesn't have a userprofile redirect
  const authUserWithProfile = await prisma.user.findUnique({
    where: { id: session.userID },
    include: { user_profile: true }
  })
  console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥')
  console.log(authUserWithProfile)

  if (authUserWithProfile?.id && !authUserWithProfile.user_profile?.handle) {
    console.log('here')
    return {
      redirect: {
        permanent: false,
        destination: '/profile/my_profile',
      },
      props: {},
    }
  }

  const profiles = await prisma.user_profile.findMany()
  return {
    props: {
      userProfiles: profiles,
    },
  }
}

export default function (props) {
  const { data: session, status } = useSession() // "loading" | "authenticated" | "unauthenticated"
  const [searchText, setSearchText] = useState('')
  const [isLargerThan1280] = useMediaQuery('(min-width: 1290px)')
  const onChangeHandler = (e) => {
    setSearchText(e.target.value)
    console.log(searchText)
  }


  if (status === 'loading') {
    return <h1>Loading</h1>
  }

  if (status === 'authenticated') { // signed in user experience


    return (
      <Flex direction={"column"}>
        <Center>
          <form>
            <Flex direction={'row'}>
              <FormControl isRequired w={'500px'} p={3}>
                <Input
                  value={searchText}
                  name='profile_name'
                  placeholder="Search in name, bio, skillset... "
                  onChange={(e) => onChangeHandler(e)}
                />
              </FormControl>
              <Button
                colorScheme='blue'
                type='submit'
                w={100}
                mt={3}
              >Search</Button>
            </Flex>
          </form>
        </Center>
        <Flex direction={'row'}>
          Conferences
        </Flex>
        <Flex direction={'row'}>
          Skills
        </Flex>
        <Flex direction={'row'}>
          Open to...
        </Flex>

        <Grid templateColumns={isLargerThan1280 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'} gap={3}>
          {props.userProfiles.map(userProfile => (
            <GridItem>
              <MemberProfileCard user_profile={userProfile} />
            </GridItem>
          ))}

        </Grid>
      </Flex>
    )
  }
  // anonymous visitor landing page
  if (status === "unauthenticated") {
    return (
      <Box position={"relative"}>
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            >
              Connect Web3 Builders so the{" "}
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                Revolution
              </Text>{" "}
              can Happen Faster
            </Heading>
            <Box w="300px">
              <Image src="/profile_example.png" />
            </Box>
          </Stack>
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
          >
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Join the Party
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  !
                </Text>
              </Heading>
              <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                Claim your all-in-one place web3 online profile, tell your story,
                and connect with an amazing network of the web3 buiders.
              </Text>
            </Stack>
            <Link
              href={"https://9bk2r1lhrv9.typeform.com/to/cCU2tLnN"}
              isExternal
            >
              <Button
                fontFamily={"heading"}
                mt={3}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
              >
                Get Started
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>
    );
  }
}
