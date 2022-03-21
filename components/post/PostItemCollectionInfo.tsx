import React from 'react';
import ReactMarkdown from "react-markdown";
import { Box, VStack, Image, Button, Heading, Text, Stack, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { CgWebsite } from "react-icons/cg";
import { FaDiscord, FaInstagram, FaTwitter, FaTelegram, FaMedium, FaWikipediaW } from "react-icons/fa";
import { GiSailboat } from "react-icons/gi";
type Props = {
    post: any;
};
const externaLinks = {
    external_url: { icon: CgWebsite, url: "", label: "Website" },
    slug: {
        icon: GiSailboat,
        url: `https://opensea.io/collection/`,
        label: "OpenSea",
    },
    twitter_username: {
        icon: FaTwitter,
        url: `https://twitter.com/`,
        label: "Twitter",
    },
    discord_url: { icon: FaDiscord, url: "", label: "Discord" },
    instagram_username: {
        icon: FaInstagram,
        url: `https://www.instagram.com/`,
        label: "Instagram",
    },
    telegram_url: { icon: FaTelegram, url: "", label: "Telegram" },
    medium_username: {
        icon: FaMedium,
        url: `https://medium.com/@`,
        label: "Medium",
    },
    wiki_url: { icon: FaWikipediaW, url: "", label: "Wiki" },
};

const PostItemCollectionInfo: React.FC<Props> = ({ post }) => {
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow(!show);
    return (
        <VStack py={3} maxW={'100%'}>
            {/* <Box w={"100%"}>
                <Heading as="h1" size="lg" isTruncated my={3} px={3} flex={1}>
                    {post.collection.name}
                </Heading>
            </Box> */}
            <Heading as='h1'>
                {post.collection.name}
            </Heading>
            <Box maxH={200} overflow="hidden" w={"100%"} position="relative">
                <Image
                    src={post.collection.banner_image_url || "/default_gray.png"}
                    alt="Collection Banner Image"
                />
            </Box>
            <Flex justifyContent="center">
                {post.collection.image_url && (
                    <Box
                        maxH={80}
                        marginTop={-20}
                        zIndex={1}
                        borderRadius={"50%"}
                        overflow="hidden"
                        border="2px"
                        borderColor={"white"}
                    >
                        <Image src={post.collection.image_url} />
                    </Box>
                )}
            </Flex>
            {/* Collection description */}
            <Box pt={3} width={'100%'}>
                <Text noOfLines={show ? 0 : 2}>
                    <ReactMarkdown>{post.collection.description}</ReactMarkdown>
                </Text>
                <Button size="sm" onClick={handleToggle} variant={"link"}>
                    Show {show ? "Less" : "More"}
                </Button>
            </Box>
            <Flex direction="row" w={"100%"} justify={"flex-end"}>
                {/* Collection metadata: social website etc */}
                <Stack direction={"row"}>
                    {Object.entries(externaLinks).map(
                        ([key, { icon: IconComponent, url, label }]) => {
                            return (
                                post.collection[key] && (
                                    <Tooltip label={label}>
                                        <a href={`${url}${post.collection[key]}`} target={"_blank"} rel="noreferrer">
                                            <IconButton
                                                aria-label={label}
                                                icon={<IconComponent size={25} />}
                                            />
                                        </a>
                                    </Tooltip>
                                )
                            );
                        }
                    )}
                </Stack>
            </Flex>

        </VStack>
    );
};

export default PostItemCollectionInfo;