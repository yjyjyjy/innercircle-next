import {
    Flex,
    Text,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Checkbox,
    Grid,
    GridItem,
    Center,
    useMediaQuery,
    useToast,
    FormErrorMessage,
} from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

import { user_profile } from '@prisma/client'
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from 'react'
import MemberProfileCard, { UserProfileWithMetaData } from '../../components/profile/MemberProfileCard'
import { ESession } from '../index'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router'

export async function getServerSideProps(context) {
    const session = (await getSession(context)) as ESession

    //If you haven't logged in, you can't view your profile
    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
            props: {},
        }
    }

    // current logged in user's id
    const userID = session.userID

    const user = await prisma.user.findUnique({
        where: {
            id: userID,
        },
        include: {
            user_profile: {
                include: {
                    user_profile_to_conference_mapping: true,
                }
            },
        },
    })

    const conferences = await prisma.conference.findMany({
        where: {
            end_date: { gte: new Date() }
        },
        orderBy: { end_date: 'asc' },
        take: 50
    })

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            conferences: JSON.parse(JSON.stringify(conferences)),
        },
    }
}

export default ({ user, conferences }) => {
    const { user_profile: userProfile } = user
    const router = useRouter()
    const toast = useToast()

    const [confMappingState, setConfMappingState] = useState(userProfile.user_profile_to_conference_mapping)





    // const createOrUpdateUserProfile = async (formData) => {
    //     const userProfileToUpload = formData
    //     // delete addtional information before pushing to the backend.
    //     delete userProfileToUpload.user_profile_to_conference_mapping

    //     const res = await fetch('/api/profile', {
    //         method: 'POST',
    //         body: JSON.stringify(userProfileToUpload),
    //     })
    //     const { message } = await res.json()
    //     toast({
    //         title: message,
    //         status: res.status === 200 ? 'success' : 'error',
    //         duration: 4000,
    //         isClosable: true,
    //     })
    //     router.push('/')
    // }

    // const OpenToCheckBox: React.FC<{ dataKey: string; text: string }> = ({
    //     dataKey,
    //     text,
    // }) => {
    //     const { values, setFieldValue } = useContext(FormContext)
    //     return (
    //         <Checkbox
    //             p={1}
    //             name={dataKey}
    //             onChange={() => {
    //                 const selectedLabel = Object.keys(values).filter(
    //                     (dataKey) =>
    //                         dataKey.startsWith('label_') &&
    //                         values[`${dataKey}`] === true
    //                 )
    //                 //If trying to add new label
    //                 if (selectedLabel.length < 5 && !values[`${dataKey}`]) {
    //                     setFieldValue(dataKey, true)
    //                 }
    //                 //If trying to de-select a label
    //                 else if (values[`${dataKey}`]) {
    //                     setFieldValue(dataKey, false)
    //                 }
    //             }}
    //             isChecked={values[`${dataKey}`]}
    //         >
    //             {text}
    //         </Checkbox>
    //     )
    // }

}

