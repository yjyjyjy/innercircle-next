import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Button,
  SimpleGrid,
  Image,
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
} from "@chakra-ui/react";

import { getSession, useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { Session } from 'next-auth'
import prisma from '../lib/prisma'
import MemberProfileCard, { columnNameToTagTextMapping } from "../components/profile/MemberProfileCard";
import { AddIcon } from "@chakra-ui/icons";
import {
  Select,
  OptionBase,
  GroupBase
} from "chakra-react-select";
import { UserProfileWithMetaData } from "../components/profile/MemberProfileCard";

export interface ESession extends Session {
  userID: string
}

export async function getServerSideProps(context) {

  // If you haven't logged in, you can't use the tool yet.
  const session = (await getSession(context)) as ESession
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

  const profiles: UserProfileWithMetaData[] = await prisma.user_profile.findMany({
    include: {
      user_profile_to_conference_mapping: {
        include: { conference: true }
      },
      connection_connection_user_profile_startTouser_profile: true,
      connection_request_connection_request_requested_idTouser_profile: true,
    }
  })

  const conferences = await prisma.conference.findMany({
    where: {
      end_date: { gte: new Date() }
    },
    orderBy: { end_date: 'asc' },
    take: 10
  })

  const profilesWithAuthUserProfileId = profiles.map(p => {
    p['authUserProfileId'] = authUserWithProfile?.user_profile?.id
    return p
  })

  return {
    props: {
      userProfiles: JSON.parse(JSON.stringify(profilesWithAuthUserProfileId)),
      conferences: JSON.parse(JSON.stringify(conferences)),
    },
  }
}

export const FilterTag = (
  {
    label,
    isChecked = false,
    colorTheme = 'blue',
    onClick
  }
) => (
  <Box
    p={2}
  >
    <Tag
      size={'lg'}
      onClick={onClick}
      variant={isChecked ? 'solid' : 'outline'}
      colorScheme={colorTheme}
      _hover={{ cursor: 'pointer', bg: colorTheme + '.100' }}
    >
      <TagLeftIcon boxSize='12px' as={AddIcon} />
      <TagLabel>{label}</TagLabel>
    </Tag >
  </Box>
)

export default function ({ userProfiles, conferences }) {
  const { data: session, status } = useSession()

  const [isDesktop] = useMediaQuery('(min-width: 1290px)')

  const [searchText, setSearchText] = useState('')
  const onSearchTextChangeHandler = (e) => {
    setSearchText(e.target.value)
    // TODO Build the search function
  }

  //**************************** Manage the user discover filters */
  interface IFilterState {
    conferences: string[],
    skills: string[],
    labels: string[]
  }

  interface FilterOption extends OptionBase {
    label: string;
    value: string;
    color?: string;
  }

  const [filterState, setFilterState] = useState<IFilterState>({
    conferences: [],
    skills: [],
    labels: []
  })
  const onConferenceFilterClickHandler = ({ id, name }) => {
    console.log(id, name)
    console.log(filterState)
    if (filterState.conferences.includes(id))
      setFilterState({ ...filterState, conferences: filterState.conferences.filter(item => item !== id) })
    else {
      setFilterState({ ...filterState, conferences: [...filterState.conferences, id] })
    }
  }



  if (status === 'loading') {
    return <h1>Loading</h1>
  }

  // signed in user experience
  if (status === 'authenticated') {

    const userProfilesWithConferences = userProfiles.map(
      userProfile => (
        {
          ...userProfile,
          conference_ids: userProfile.user_profile_to_conference_mapping.map(
            m => m.conference.id
          )
        }
      )
    )

    const skillLabelSelectOptions = Object.keys(columnNameToTagTextMapping).map(dataKey => (
      { value: dataKey, label: columnNameToTagTextMapping[dataKey], color: 'blue' }
    ))

    return (
      <Flex direction={"column"}>
        <Center>
          <form>
            <Flex direction={'row'}>
              <FormControl isRequired w={isDesktop ? '500px' : '150px'} p={3}>
                <Input
                  value={searchText}
                  name='profile_name'
                  placeholder="Search in name, bio (coming soon ...)"
                  onChange={(e) => onSearchTextChangeHandler(e)}
                />
              </FormControl>
              <Button
                colorScheme='blue'
                type='submit'
                disabled={true}
                w={150}
                mt={3}
              >Coming soon</Button>
            </Flex>
          </form>
        </Center>

        <Flex direction={'row'} wrap={'wrap'} >
          <Text
            transform="translateY(25%)"
            fontWeight={'bold'}
            pr={'2'}
          >Filter on conferences: (coming soon...)</Text>
          {conferences.map(
            conf => FilterTag(
              {
                label: conf.conference_name,
                isChecked: filterState.conferences.includes(conf.id),
                onClick: () => onConferenceFilterClickHandler({ id: conf.id, name: conf.conference_name })
              }
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

        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={3}>
          {userProfilesWithConferences.filter(
            p => (
              (filterState.conferences.length === 0 || p.conference_ids.some(r => filterState.conferences.indexOf(r) >= 0))
              && (filterState.skills.length === 0 || filterState.skills.map(k => p[k]).some(v => v === true))
              && (filterState.labels.length === 0 || filterState.labels.map(k => p[k]).some(v => v === true))
            )
          ).map(userProfile => (
            <GridItem key={userProfile.id}>
              <MemberProfileCard userProfile={userProfile} />
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
              Happens Faster
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

                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  Join the Party!
                </Text>
              </Heading>
              <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
                Claim your all-in-one place web3 online profile, tell your story,
                and connect with an amazing network of the web3 buiders.
              </Text>
            </Stack>
            {/* <Link
              href={"https://9bk2r1lhrv9.typeform.com/to/cCU2tLnN"}
              isExternal
            > */}
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
              onClick={() => signIn()}
            >
              Get Started!
            </Button>
            {/* </Link> */}
          </Stack>
        </Container>
      </Box>
    );
  }
}
