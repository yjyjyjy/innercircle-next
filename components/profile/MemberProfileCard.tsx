import {
    Box,
    Flex,
    Text,
    Button,
    Tag,
    Stack,
    TagLabel,
    useToast,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Textarea,
    FormControl,
    FormErrorMessage,
    FormHelperText,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import {
    user_profile,
    user_profile_to_conference_mapping,
    conference,
    connection_request,
    connection,
} from "@prisma/client"
import { useFormik } from "formik"
import { inviteMessageMaxLength } from "../../lib/const"
import Link from "next/link"
import { CloudinaryImage } from "@cloudinary/url-gen"
import { defaultImage } from "@cloudinary/url-gen/actions/delivery"
import { scale } from "@cloudinary/url-gen/actions/resize"
import ProfilePicture from "./ProfilePicture"

export type UserProfileWithMetaData = user_profile & {
    user_profile_to_conference_mapping?: (user_profile_to_conference_mapping & {
        conference: conference
    })[]
    connection_connection_user_profile_startTouser_profile?: connection[]
    connection_request_connection_request_requested_idTouser_profile?: connection_request[]
    authUserProfileId?: number
}

type Props = {
    userProfile: UserProfileWithMetaData
    mini?: boolean
    authUserProfileId?: number
    profilePictureFile?: File
}

export const columnNameToTagTextMapping = {
    label_hiring: "I'm hiring",
    label_open_to_work: "Open to work",
    label_open_to_cofounder_matching: "Cofounder Searching",
    label_need_product_feedback: "Need Feedback",
    label_open_to_discover_new_project: "Discovering",
    label_fundraising: "Fundraising",
    label_open_to_invest: "Open To Invest",
    label_on_core_team: "On Core Team",
    skill_founder: "Founder",
    skill_web3_domain_expert: "Web3 Expert",
    skill_artist: "Artist",
    skill_frontend_eng: "Frontend Eng",
    skill_backend_eng: "Backend Eng",
    skill_fullstack_eng: "Full Stack Eng",
    skill_blockchain_eng: "Blockchain Eng",
    skill_data_eng: "Data Eng",
    skill_data_science: "Data Scientist",
    skill_game_dev: "Game Dev",
    skill_dev_ops: "DevOps Eng",
    skill_product_manager: "Prod Mgr.",
    skill_product_designer: "Prod Designer",
    skill_token_designer: "Token Designer",
    skill_technical_writer: "Technical Writer",
    skill_social_media_influencer: "Social Influencer",
    skill_i_bring_capital: "I Bring Capital",
    skill_community_manager: "Community Mgr.",
    skill_marketing_growth: "Marketing/Growth",
    skill_business_development: "Biz Dev",
    skill_developer_relations: "Dev Relations",
    skill_influencer_relations: "Influencer Relations",
    skill_investor_relations: "Investor Relations",
}

const MemberProfileCard: React.FC<Props> = ({
    userProfile,
    mini = true,
    profilePictureFile,
}) => {
    const {
        id,
        handle,
        profile_name,
        profile_picture,
        twitter,
        linkedin,
        bio_short,
        bio,
        label_hiring,
        label_open_to_work,
        label_open_to_cofounder_matching,
        label_need_product_feedback,
        label_open_to_discover_new_project,
        label_fundraising,
        label_open_to_invest,
        label_on_core_team,
        label_text_hiring,
        label_text_open_to_work,
        label_text_open_to_discover_new_project,
        skill_founder,
        skill_web3_domain_expert,
        skill_artist,
        skill_frontend_eng,
        skill_backend_eng,
        skill_fullstack_eng,
        skill_blockchain_eng,
        skill_data_eng,
        skill_data_science,
        skill_hareware_dev,
        skill_game_dev,
        skill_dev_ops,
        skill_product_manager,
        skill_product_designer,
        skill_token_designer,
        skill_technical_writer,
        skill_social_media_influencer,
        skill_i_bring_capital,
        skill_community_manager,
        skill_marketing_growth,
        skill_business_development,
        skill_developer_relations,
        skill_influencer_relations,
        skill_investor_relations,
        user_profile_to_conference_mapping,
        authUserProfileId,
        email,
    } = userProfile

    const toast = useToast()

    console.log("email: ", email)

    const cldImg = new CloudinaryImage(email ? email : "default.png", {
        cloudName: "innercircle",
    })
        .delivery(defaultImage("default.png"))
        .resize(scale().height(100).width(100))

    const [uploadedImg, setuploadedImg] = useState<string>()

    const updateProfilePhoto = (profile_picture_file: File) => {
        const reader = new FileReader()

        reader.onload = function (onLoadEvent) {
            if (onLoadEvent?.target?.result) {
                setuploadedImg(onLoadEvent.target.result.toString())
            }
        }

        reader.readAsDataURL(profile_picture_file)
    }

    useEffect(() => {
        if (profilePictureFile) updateProfilePhoto(profilePictureFile)
    }, [profilePictureFile])

    const ProfileTag: React.FC<{ dataKey: string }> = ({ dataKey }) => (
        <Tag
            size={"lg"}
            bgGradient={
                dataKey.startsWith("skill_")
                    ? "linear(to-l, #4776E6,  #8E54E9)" // skills
                    : "linear(to-l, #FF512F, #DD2476)" // labels
            }
            variant={"solid"}
            m={1}
        >
            <TagLabel>{columnNameToTagTextMapping[dataKey]}</TagLabel>
        </Tag>
    )

    //********************** Managing Connect Button State */

    let connectButtonInitValue = {
        label: "Connect",
        isDisabled: false,
        shouldRender: true,
    }

    // if the user is not logged or this is not passed in or authUser is the owner of the profile (oneself). Connect button is not available.
    if (!authUserProfileId || authUserProfileId === userProfile.id) {
        connectButtonInitValue["shouldRender"] = false
    }

    // If auth user has requested connecting with the user profile owner
    const connectionRequesters =
        userProfile.connection_request_connection_request_requested_idTouser_profile?.map(
            (req) => req.initiator_id
        )
    if (
        authUserProfileId &&
        connectionRequesters &&
        connectionRequesters.includes(authUserProfileId)
    ) {
        connectButtonInitValue = {
            label: "Pending",
            isDisabled: true,
            shouldRender: true,
        }
    }

    // If the user profile owner is connected to auth user
    const connections =
        userProfile.connection_connection_user_profile_startTouser_profile?.map(
            (con) => con.user_profile_end
        )
    if (
        authUserProfileId &&
        connections &&
        connections.includes(authUserProfileId)
    ) {
        connectButtonInitValue = {
            label: "Message",
            isDisabled: false,
            shouldRender: true,
        }
    }

    const [connectButtonStatus, setConnectButtonStatus] = useState(
        connectButtonInitValue
    )

    //*********************** Message Modal */
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const ConnectReqestModal = () => {
        // const [inviteMessage, setInviteMessage] = useState('')
        const formik = useFormik({
            initialValues: {
                inviteMessage: "",
            },
            onSubmit: async (values) => {
                const res = await fetch("/api/connection", {
                    method: "POST",
                    body: JSON.stringify({
                        targetUserProfileId: id,
                        inviteMessage: values.inviteMessage,
                    }),
                })

                const { message } = await res.json()
                toast({
                    title: message,
                    status: res.status === 200 ? "success" : "error",
                    duration: 4000,
                    isClosable: true,
                })

                // close the modal
                onClose()
                // change the button text and look
                setConnectButtonStatus({
                    ...connectButtonStatus,
                    label: "Pending",
                    isDisabled: true,
                })
            },
            validate: (values) => {
                const errors = {}
                if (values.inviteMessage.length > inviteMessageMaxLength) {
                    errors[
                        "inviteMessage"
                    ] = `The message is too long (max ${inviteMessageMaxLength} char)`
                }
                return errors
            },
        })

        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                initialFocusRef={initialRef}
                size={"lg"}
            >
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={formik.handleSubmit}>
                        <ModalHeader>Connect Request</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl
                                isInvalid={!!formik.errors.inviteMessage}
                            >
                                <Textarea
                                    placeholder="(Optional) Include a Short message..."
                                    value={formik.values.inviteMessage}
                                    name={"inviteMessage"}
                                    onChange={formik.handleChange}
                                    ref={initialRef}
                                    rows={7}
                                />
                                {!formik.errors.inviteMessage ? (
                                    <FormHelperText>
                                        {`Max ${inviteMessageMaxLength} characters`}
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>
                                        {formik.errors.inviteMessage}
                                    </FormErrorMessage>
                                )}
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" ml={3} type="submit">
                                Send
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        )
    }

    return (
        <Stack
            direction={"column"}
            p={6}
            w={mini ? "350px" : "500px"}
            maxH={"800px"}
            boxShadow={"lg"}
            rounded={"lg"}
            _hover={{
                cursor: mini && "pointer",
                boxShadow: mini && "2xl",
            }}
            transition="0.3s"
            borderColor={"#ebebeb"}
            borderWidth={"thin"}
        >
            <ProfilePicture img={uploadedImg ? uploadedImg : cldImg} />

            <Flex direction={"row"} pt={4}>
                <Link href={`/in/${handle}`}>
                    <Flex direction={"column"} w="60%" overflow={"hidden"}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>
                            {profile_name}
                        </Text>
                        <Text fontSize={"sm"}>@{handle}</Text>
                    </Flex>
                </Link>
                {connectButtonStatus.shouldRender && (
                    <Button
                        colorScheme={"blue"}
                        w={"80px"}
                        h={"30px"}
                        isDisabled={connectButtonStatus.isDisabled}
                        onClick={
                            connectButtonStatus.label === "Connect"
                                ? onOpen
                                : () => {}
                        }
                    >
                        {connectButtonStatus.label}
                    </Button>
                )}
                <ConnectReqestModal />
            </Flex>
            <Text fontWeight="bold">{bio_short}</Text>
            <Text noOfLines={mini ? 2 : 6}>{bio}</Text>
            <Box>
                <Text fontWeight={"bold"}>I need:</Text>
                <Flex direction={"row"} wrap={"wrap"}>
                    {Object.keys(columnNameToTagTextMapping)
                        .filter((dataKey) => dataKey.startsWith("label_"))
                        .map((dataKey) =>
                            userProfile[dataKey] ? (
                                <ProfileTag key={dataKey} dataKey={dataKey} />
                            ) : undefined
                        )}
                </Flex>
            </Box>
            <Text fontWeight={"bold"}>I can offer:</Text>
            <Flex direction={"row"} wrap={"wrap"}>
                {Object.keys(columnNameToTagTextMapping)
                    .filter((dataKey) => dataKey.startsWith("skill_"))
                    .map((dataKey) =>
                        userProfile[dataKey] ? (
                            <ProfileTag key={dataKey} dataKey={dataKey} />
                        ) : undefined
                    )}
            </Flex>
            {user_profile_to_conference_mapping &&
                user_profile_to_conference_mapping?.length > 0 && (
                    <Box>
                        <Text fontWeight={"bold"}>You may find me at:</Text>
                        <Flex direction={"row"} wrap={"wrap"}>
                            {user_profile_to_conference_mapping.map((m) => (
                                <Tag
                                    key={m.conference.id}
                                    size={"lg"}
                                    bgGradient={
                                        "linear(to-l, #182848, #4b6cb7)"
                                    }
                                    variant={"solid"}
                                    m={1}
                                >
                                    <TagLabel>
                                        {m.conference.conference_name}
                                    </TagLabel>
                                </Tag>
                            ))}
                        </Flex>
                    </Box>
                )}
        </Stack>
    )
}

export default MemberProfileCard
