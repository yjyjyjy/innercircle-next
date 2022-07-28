import { Flex, FormControl, Grid, GridItem, Text } from '@chakra-ui/react'
import { Select, GroupBase, OptionBase } from 'chakra-react-select'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { FilterTag } from './FilterTag'
import MemberProfileCard, {
   columnNameToTagTextMapping,
} from './profile/MemberProfileCard'

interface IAuthenticatedUser {
   userProfiles: Array<any>
   conferences: Array<any>
}

interface IFilterState {
   conferences: string[]
   skills: string[]
   labels: string[]
}

interface FilterOption extends OptionBase {
   label: string
   value: string
   color?: string
}

// const MessageModal = dynamic(() => import('./messaging/Chat'), {
//    ssr: false,
//    loading: () => <p>...</p>,
// })

const AuthenticatedUser = ({
   userProfiles,
   conferences,
}: IAuthenticatedUser) => {
   const [searchText, setSearchText] = useState('')
   const onSearchTextChangeHandler = (e) => {
      setSearchText(e.target.value)
      // TODO Build the search function
   }
   let userProfilesWithConferences = userProfiles.map((userProfile) => ({
      ...userProfile,
      conference_ids: userProfile.user_profile_to_conference_mapping.map(
         (m) => m.conference.id
      ),
   }))

   userProfilesWithConferences = shuffle(userProfilesWithConferences)

   const skillLabelSelectOptions = Object.keys(columnNameToTagTextMapping).map(
      (dataKey) => ({
         value: dataKey,
         label: columnNameToTagTextMapping[dataKey],
         color: 'blue',
      })
   )

   const [filterState, setFilterState] = useState<IFilterState>({
      conferences: [],
      skills: [],
      labels: [],
   })

   const onConferenceFilterClickHandler = ({ id, name }) => {
      if (filterState.conferences.includes(id))
         setFilterState({
            ...filterState,
            conferences: filterState.conferences.filter((item) => item !== id),
         })
      else {
         setFilterState({
            ...filterState,
            conferences: [...filterState.conferences, id],
         })
      }
   }

   function shuffle(array) {
      let currentIndex = array.length,
         randomIndex

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
         // Pick a remaining element.
         randomIndex = Math.floor(Math.random() * currentIndex)
         currentIndex--

            // And swap it with the current element.
            ;[array[currentIndex], array[randomIndex]] = [
               array[randomIndex],
               array[currentIndex],
            ]
      }

      return array
   }

   return (
      <Flex direction={'column'}>
         {/* <Center>
            <form>
               <Flex direction={'row'}>
                  <FormControl
                     isRequired
                     w={isDesktop ? '500px' : '150px'}
                     p={3}
                  >
                     <Input
                        value={searchText}
                        name="profile_name"
                        placeholder="Search in name, bio (coming soon ...)"
                        onChange={(e) => onSearchTextChangeHandler(e)}
                     />
                  </FormControl>
                  <Button
                     colorScheme="blue"
                     type="submit"
                     disabled={true}
                     w={150}
                     mt={3}
                  >
                     Coming soon
                  </Button>
               </Flex>
            </form>
         </Center> */}

         <Flex direction={'row'} wrap={'wrap'}>
            <Text transform="translateY(25%)" fontWeight={'bold'} pr={'2'}>
               Filter on conferences:
            </Text>
            {/* <FormControl py={3} display={'inline'}>
               <Select<FilterOption, true, GroupBase<FilterOption>>
                  isMulti
                  name="colors"
                  colorScheme="purple"
                  options={conferences.map(conf => {
                     return conf.conference_name
                  })}
                  placeholder="Select the conferences they go ..."
                  closeMenuOnSelect={false}
                  onChange={(e) => {
                     setFilterState({
                        ...filterState,
                        skills: e.map((item) => item.value) || [],
                     })
                  }}
               />
            </FormControl> */}
            {conferences.map((conf) =>
               FilterTag({
                  label: conf.conference_name,
                  startDate: conf.start_date.substring(5, 10),
                  isChecked: filterState.conferences.includes(conf.id),
                  onClick: () =>
                     onConferenceFilterClickHandler({
                        id: conf.id,
                        name: conf.conference_name,
                     }),
               })
            )}
         </Flex>

         <Flex direction={'row'} wrap={'wrap'}>
            <Text transform="translateY(25%)" fontWeight={'bold'} pr={'2'}>
               Filter on their skills / experiences:
            </Text>
            <FormControl py={3} display={'inline'}>
               <Select<FilterOption, true, GroupBase<FilterOption>>
                  isMulti
                  name="colors"
                  colorScheme="purple"
                  options={skillLabelSelectOptions.filter((item) =>
                     item.value.startsWith('skill_')
                  )}
                  placeholder="Select the skills they have ..."
                  closeMenuOnSelect={false}
                  onChange={(e) => {
                     setFilterState({
                        ...filterState,
                        skills: e.map((item) => item.value) || [],
                     })
                  }}
               />
            </FormControl>
         </Flex>

         <Flex direction={'row'} wrap={'wrap'}>
            <Text transform="translateY(25%)" fontWeight={'bold'} pr={'2'}>
               Filter on their needs:
            </Text>
            <FormControl py={3} display={'inline'}>
               <Select<FilterOption, true, GroupBase<FilterOption>>
                  isMulti
                  name="colors"
                  colorScheme="pink"
                  options={skillLabelSelectOptions.filter((item) =>
                     item.value.startsWith('label_')
                  )}
                  placeholder="Select the need they expressed ..."
                  closeMenuOnSelect={false}
                  onChange={(e) => {
                     setFilterState({
                        ...filterState,
                        labels: e.map((item) => item.value) || [],
                     })
                  }}
               />
            </FormControl>
         </Flex>

         <Grid
            templateColumns={[
               'repeat(1, 1fr)',
               'repeat(2, 1fr)',
               'repeat(3, 1fr)',
            ]}
            gap={3}
         >
            {userProfilesWithConferences
               .filter(
                  (p) =>
                     (filterState.conferences.length === 0 ||
                        p.conference_ids.some(
                           (r) => filterState.conferences.indexOf(r) >= 0
                        )) &&
                     (filterState.skills.length === 0 ||
                        filterState.skills
                           .map((k) => p[k])
                           .some((v) => v === true)) &&
                     (filterState.labels.length === 0 ||
                        filterState.labels
                           .map((k) => p[k])
                           .some((v) => v === true))
               )
               .sort((a, b) => {
                  return b.conference_ids.length === 0 &&
                     a.conference_ids.length === 0
                     ? 0
                     : a.conference_ids.length > 0
                        ? -1
                        : 1
               })
               .map((userProfile) => (
                  <GridItem key={userProfile.id}>
                     <MemberProfileCard userProfile={userProfile} />
                  </GridItem>
               ))}
         </Grid>

         {/* <MessageModal /> */}
      </Flex>
   )
}

export default AuthenticatedUser
