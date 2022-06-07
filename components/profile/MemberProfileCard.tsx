import { Box, Flex, Text, Image, Button, IconButton, Tag, Stack, TagLeftIcon, TagLabel } from "@chakra-ui/react";
import React from "react";
import ProfilePicture from "./ProfilePicture";
import { AiOutlineMail } from 'react-icons/ai';

export interface UserProfileData {
    id?: number,
    profile_name: string,
    handle: string,
    profile_picture?: string,
    email?: string,
    twitter?: string,
    linkedin?: string,
    bio?: string,
    hiring?: boolean,
    open_to_work?: boolean,
    open_to_cofounder_matching?: boolean,
    open_to_product_feedback?: boolean,
    fundraising?: boolean,
    open_to_invest?: boolean,
    on_core_team?: boolean,
    skill_founder?: boolean,
    skill_frontend_eng?: boolean,
    skill_backend_eng?: boolean,
    skill_fullstack_eng?: boolean,
    skill_blockchain_eng?: boolean,
    skill_data_eng?: boolean,
    skill_game_dev?: boolean,
    skill_dev_ops?: boolean,
    skill_product_manager?: boolean,
    skill_product_designer?: boolean,
    skill_token_designer?: boolean,
    skill_technical_writer?: boolean,
    skill_project_launch?: boolean,
    skill_people_connector?: boolean,
    skill_community_manager?: boolean,
    skill_marketing_growth?: boolean,
    skill_developer_relations?: boolean,
    skill_influencer_relations?: boolean,
    skill_investor_relations?: boolean,
}

type Props = {
    user_profile: UserProfileData;
};

const MemberProfileCard: React.FC<Props> = ({ user_profile }) => {
    const {
        handle,
        profile_name,
        profile_picture,
        twitter,
        linkedin,
        bio,
        hiring,
        open_to_work,
        open_to_cofounder_matching,
        open_to_product_feedback,
        fundraising,
        open_to_invest,
        on_core_team,
        skill_founder,
        skill_frontend_eng,
        skill_backend_eng,
        skill_fullstack_eng,
        skill_blockchain_eng,
        skill_data_eng,
        skill_game_dev,
        skill_dev_ops,
        skill_product_manager,
        skill_product_designer,
        skill_token_designer,
        skill_technical_writer,
        skill_project_launch,
        skill_people_connector,
        skill_community_manager,
        skill_marketing_growth,
        skill_developer_relations,
        skill_influencer_relations,
        skill_investor_relations,
    } = user_profile

    const tagTextMapping = {
        hiring: "I'm hiring",
        open_to_work: "Open to work",
        open_to_cofounder_matching: "Cofounder Searching",
        open_to_product_feedback: "Need Feedback",
        fundraising: "fundraising",
        open_to_invest: "Open To Invest",
        on_core_team: "On Core Team",
        skill_founder: "Founder",
        skill_frontend_eng: "Frontend Eng",
        skill_backend_eng: "Backend Eng",
        skill_fullstack_eng: "Full Stack Eng",
        skill_blockchain_eng: "Blockchain Eng",
        skill_data_eng: "Data Eng",
        skill_game_dev: "Game Dev",
        skill_dev_ops: "DevOps Eng",
        skill_product_manager: "Prod Mgr.",
        skill_product_designer: "Prod Designer",
        skill_token_designer: "Token Designer",
        skill_technical_writer: "Technical Writer",
        skill_people_connector: "People Connector",
        skill_community_manager: "Community Mgr.",
        skill_marketing_growth: "Marketing/Growth",
        skill_developer_relations: "Dev Relations",
        skill_influencer_relations: "Influencer Relations",
        skill_investor_relations: "Investor Relations",
    }

    const ProfileTag: React.FC<{ dataKey: string }> = ({ dataKey }) => (
        <Tag
            size={'lg'}
            bgGradient={dataKey.startsWith('skill_') ? 'linear(to-l, #4292ff,  #177aff)' : 'linear(to-l, #d83f91, #ae4bb8)'}
            variant={'solid'}
            m={1}>
            <TagLabel>{tagTextMapping[dataKey]}</TagLabel>
        </Tag>
    )
    return (
        // // pos={"relative"}
        // // zIndex={1}
        // // _hover={{
        // //     marginTop: "-1",
        // //     marginLeft: "-1",
        // // }}
        <Stack direction={'column'}
            p={6}
            maxW={"450px"}
            maxH={"650px"}
            // w={"full"}
            boxShadow={"xl"}
            rounded={"lg"}>
            <ProfilePicture image_url={'https://en.gravatar.com/userimage/67165895/bd41f3f601291d2f313b1d8eec9f8a4d.jpg?size=200'} />
            <Flex direction={'row'} pt={4}>
                <Text
                    w='60%'
                    overflow={'hidden'}
                >{profile_name}
                </Text>
                <Tag variant={'outline'}>
                    <TagLeftIcon as={AiOutlineMail} />
                    <TagLabel>Message</TagLabel>
                </Tag>
            </Flex>
            <Text py={2}>{bio}</Text>
            <Flex direction={'row'} pt={2} wrap={'wrap'}>
                {Object.keys(tagTextMapping).filter(dataKey => !dataKey.startsWith('skill_')).map(dataKey => (
                    user_profile[dataKey] ? <ProfileTag key={dataKey} dataKey={dataKey} /> : undefined
                ))}
            </Flex>
            <Flex direction={'row'} pt={2} wrap={'wrap'}>
                {Object.keys(tagTextMapping).filter(dataKey => dataKey.startsWith('skill_')).map(dataKey => (
                    user_profile[dataKey] ? <ProfileTag key={dataKey} dataKey={dataKey} /> : undefined
                ))}
            </Flex>
        </Stack>
    );
};

export default MemberProfileCard;
