import React from 'react';
import ReactMarkdown from "react-markdown";
import { Box, VStack, Image, Button, Heading, Text, Stack, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { CgWebsite } from "react-icons/cg";
import { FaDiscord, FaInstagram, FaTwitter, FaTelegram, FaMedium, FaWikipediaW } from "react-icons/fa";
import { GiSailboat } from "react-icons/gi";
type Props = {
    collection: any;
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

const PostItemCollectionInfo: React.FC<Props> = ({ collection }) => {
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow(!show);
    return (
        <Flex py={3} maxW={'100%'} direction='column' overflow={'hidden'}>
            <Heading as='h1'>
                {collection.name}
            </Heading>
            <Box maxH={200} overflow="hidden" w={"100%"} position="relative" display={'flex'} alignItems={'center'}>
                <Image
                    src={collection.banner_image_url || "/default_gray.png"}
                    alt="Collection Banner Image"
                />
            </Box>
            <Flex justifyContent="center">
                {collection.image_url && (
                    <Box
                        marginTop={-20}
                        zIndex={1}
                        borderRadius={"50%"}
                        overflow="hidden"
                        border="2px"
                        borderColor={"white"}
                    >
                        <Image
                            src={collection.image_url}
                            objectFit={'cover'}
                            width={126}
                            height={126}
                        />
                    </Box>
                )}
            </Flex>
            {/* Collection description */}
            <Box pt={3} width={'100%'}>
                <Text noOfLines={show ? 0 : 2}>
                    <ReactMarkdown>{collection.description}</ReactMarkdown>
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
                                collection[key] && (
                                    <Tooltip label={label}>
                                        <a href={`${url}${collection[key]}`} target={"_blank"} rel="noreferrer">
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

        </Flex>
    );
};

export default PostItemCollectionInfo;