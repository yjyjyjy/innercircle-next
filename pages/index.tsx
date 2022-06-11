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
  useMediaQuery,
  Tag,
  TagLeftIcon,
  TagLabel,
  VStack,
  FormLabel,
} from "@chakra-ui/react";

import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from 'next-auth'
import prisma from '../lib/prisma'
import MemberProfileCard, { columnNameToTagTextMapping } from "../components/profile/MemberProfileCard";
import { includes } from "lodash";
import { AddIcon } from "@chakra-ui/icons";
import { string } from "prop-types";
import {
  Select,
  CreatableSelect,
  AsyncSelect,
  OptionBase,
  GroupBase
} from "chakra-react-select";

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

  if (authUserWithProfile?.id && !authUserWithProfile.user_profile?.handle) {
    return {
      redirect: {
        permanent: false,
        destination: '/profile/my_profile',
      },
      props: {},
    }
  }

  const profiles = await prisma.user_profile.findMany({
    include: {
      user_profile_to_conference_mapping: {
        include: { conference: true }
      }
    }
  })

  const conferences = await prisma.conference.findMany({
    where: {
      end_date: { gte: new Date() }
    },
    orderBy: { end_date: 'asc' },
    take: 10
  })

  return {
    props: {
      userProfiles: JSON.parse(JSON.stringify(profiles)),
      conferences: JSON.parse(JSON.stringify(conferences)),
    },
  }
}

export default function (props) {
  const { data: session, status } = useSession() // "loading" | "authenticated" | "unauthenticated"
  const [isLargerThan1280] = useMediaQuery('(min-width: 1290px)')

  const [searchText, setSearchText] = useState('')
  const onSearchTextChangeHandler = (e) => {
    setSearchText(e.target.value)
    console.log(searchText)
  }

  interface IFilterState {
    conferences: string[],
    skills: string[],
    labels: string[]
  }

  const [filterState, setFilterState] = useState<IFilterState>({
    conferences: [],
    skills: [],
    labels: []
  })
  const onConferenceFilterClickHandler = ({ name }) => {
    if (filterState.conferences.includes(name))
      setFilterState({ ...filterState, conferences: filterState.conferences.filter(item => item !== name) })
    else {
      setFilterState({ ...filterState, conferences: [...filterState.conferences, name] })
    }
  }

  const filterTag = (
    {
      name,
      label,
      isChecked = false,
      colorTheme = 'blue' }
  ) => (
    <Box
      p={2}
      key={name}
    >
      <Tag
        size={'lg'}
        onClick={() => onConferenceFilterClickHandler({ name })}
        variant={isChecked ? 'solid' : 'outline'}
        colorScheme={colorTheme}
        _hover={{ cursor: 'pointer', bg: colorTheme + '.100' }}
      >
        <TagLeftIcon boxSize='12px' as={AddIcon} />
        <TagLabel>{label}</TagLabel>
      </Tag >
    </Box>
  )

  if (status === 'loading') {
    return <h1>Loading</h1>
  }

  interface FilterOption extends OptionBase {
    label: string;
    value: string;
    color?: string;
  }


  // signed in user experience
  if (status === 'authenticated') {

    const userProfiles = props.userProfiles.map(
      userProfile => (
        {
          ...userProfile,
          conference_ids: userProfile.user_profile_to_conference_mapping.map(
            m => m.conference.id
          )
        }
      )
    )
    console.log(userProfiles)

    const skillLabelSelectOptions = Object.keys(columnNameToTagTextMapping).map(dataKey => (
      { value: dataKey, label: columnNameToTagTextMapping[dataKey], color: 'blue' }
    ))
    console.log(filterState)

    return (
      <Flex direction={"column"}>
        <Center>
          <form>
            <Flex direction={'row'}>
              <FormControl isRequired w={'500px'} p={3}>
                <Input
                  value={searchText}
                  name='profile_name'
                  placeholder="Search in name, bio, skill, need ..."
                  onChange={(e) => onSearchTextChangeHandler(e)}
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

        <Flex direction={'row'} wrap={'wrap'} >
          <Text
            transform="translateY(25%)"
            fontWeight={'bold'}
            pr={'2'}
          >Filter on conferences:</Text>
          {props.conferences.map(
            conf => filterTag(
              { name: conf.id, label: conf.conference_name, isChecked: filterState.conferences.includes(conf.id) }
            ))}
        </Flex>

        <Flex direction={'row'} wrap={'wrap'}>
          <Text
            transform="translateY(25%)"
            fontWeight={'bold'}
            pr={'2'}
          >Filter on their skills / experiences:</Text>
          <FormControl py={3} display={"inline"}>
            <Select<FilterOption, true, GroupBase<FilterOption>>
              isMulti
              name="colors"
              colorScheme="purple"
              options={skillLabelSelectOptions.filter(item => item.value.startsWith('skill_'))}
              placeholder="Select the skills they have ..."
              closeMenuOnSelect={false}
              onChange={e => {
                setFilterState({ ...filterState, skills: e.map(item => item.value) || [] })
              }}
            />
          </FormControl>
        </Flex>

        <Flex direction={'row'} wrap={'wrap'}>
          <Text
            transform="translateY(25%)"
            fontWeight={'bold'}
            pr={'2'}
          >Filter on their needs:</Text>
          <FormControl py={3} display={"inline"}>
            <Select<FilterOption, true, GroupBase<FilterOption>>
              isMulti
              name="colors"
              colorScheme="pink"
              options={skillLabelSelectOptions.filter(item => item.value.startsWith('label_'))}
              placeholder="Select the need they expressed ..."
              closeMenuOnSelect={false}
              onChange={e => {
                setFilterState({ ...filterState, labels: e.map(item => item.value) || [] })
              }}
            />
          </FormControl>
        </Flex>

        <Grid templateColumns={isLargerThan1280 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'} gap={3}>
          {userProfiles.filter(
            userProfile => filterState.conferences.length === 0 || userProfile.conference_ids.some(r => filterState.conferences.indexOf(r) >= 0)
          ).map(userProfile => (
            <GridItem key={userProfile.id}>
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
