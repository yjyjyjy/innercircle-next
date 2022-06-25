import { getSession, useSession } from "next-auth/react"
import { Session } from "next-auth"
import prisma from "../lib/prisma"
import { UserProfileWithMetaData } from "../components/profile/MemberProfileCard"
import AuthenticatedUser from "../components/AuthenticatedUser"
import UnauthenticatedUser from "../components/UnauthenticatedUser"

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
        include: { user_profile: true },
    })

    if (authUserWithProfile?.id && !authUserWithProfile.user_profile?.handle) {
        return {
            redirect: {
                permanent: false,
                destination: "/profile/my_profile",
            },
            props: {},
        }
    }

    const profiles: UserProfileWithMetaData[] =
        await prisma.user_profile.findMany({
            include: {
                user_profile_to_conference_mapping: {
                    include: { conference: true },
                },
                connection_connection_user_profile_startTouser_profile: true,
                connection_request_connection_request_requested_idTouser_profile:
                    true,
            },
        })

    const conferences = await prisma.conference.findMany({
        where: {
            end_date: { gte: new Date() },
        },
        orderBy: { end_date: "asc" },
        take: 10,
    })

    const profilesWithAuthUserProfileId = profiles.map((p) => {
        p["authUserProfileId"] = authUserWithProfile?.user_profile?.id
        return p
    })

    return {
        props: {
            userProfiles: JSON.parse(
                JSON.stringify(profilesWithAuthUserProfileId)
            ),
            conferences: JSON.parse(JSON.stringify(conferences)),
        },
    }
}

const Home = ({ userProfiles, conferences }) => {
    const { status } = useSession()

    switch (status) {
        case "loading":
            return <h1>Loading</h1>
        case "authenticated":
            return (
                <AuthenticatedUser
                    conferences={conferences}
                    userProfiles={userProfiles}
                />
            )
        case "unauthenticated":
            return <UnauthenticatedUser />
        default:
            return <></>
    }
}

export default Home
