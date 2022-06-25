import { Flex, Text, Stack, Heading } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import ProfilePicture from '../../components/profile/ProfilePicture'
import { CloudinaryImage } from '@cloudinary/url-gen'
import { defaultImage } from '@cloudinary/url-gen/actions/delivery'
import { scale } from '@cloudinary/url-gen/actions/resize'

// server side data fetch
export async function getServerSideProps(context) {
    const users = await prisma.user_profile.findMany({})

    return {
        props: {
            users: users,
        },
    }
}

const User = (user) => {
    const {
        id,
        handle,
        profile_name,
        email,
        twitter,
        linkedin,
        bio,
        look_for,
        skills,
        hiring,
        open_to_work,
        on_core_team,
        open_to_invest,
        profile_picture,
        resume,
    } = user

    const cldImg = new CloudinaryImage(id ? id.toString() : '', {
        cloudName: 'innercircle',
    })
        .delivery(defaultImage('default.png'))
        .resize(scale().height(100).width(100))

    return (
        <Stack direction={'column'} maxW={'100%'}>
            <Flex h="120px" w="100%" direction={'row'} p={5}>
                <ProfilePicture img={cldImg} />
                <Flex ml={3} direction="column">
                    <Heading as={'h2'}>
                        {profile_name} ({handle})
                    </Heading>
                    <Text fontSize={15} pt={2}>
                        {email} | {twitter} | {linkedin}
                    </Text>
                    <Text fontSize={15} pt={2}>
                        {bio}
                    </Text>
                </Flex>
            </Flex>
        </Stack>
    )
}

const ShowCaseUsers = ({ users }) => {
    return (
        <>
            {users.map((user) => {
                return User(user)
            })}
        </>
    )
}

export default ShowCaseUsers
