import {
  Box,
  VStack,
  Image,
  Collapse,
  Button,
  Heading,
  Text,
  Stack,
  Flex,
  IconButton,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { CgWebsite } from "react-icons/cg";
import {
  FaDiscord,
  FaInstagram,
  FaTwitter,
  FaTelegram,
  FaMedium,
  FaWikipediaW,
  FaRocket,
  FaMoon,
} from "react-icons/fa";
import { GiSailboat, GiWhaleTail } from "react-icons/gi";
import React from "react";
import { compareDesc, formatDistanceToNow, parse } from "date-fns";
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

const PostItemCard: React.FC<Props> = ({ post }) => {
  const [show, setShow] = React.useState(false);
  const [showTable, setShowTable] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const createdDate = parse(post.created_at, "yyyy-MM-dd", new Date());
  const orderedInsights = [...post.collection.insight];
  orderedInsights.sort((a, b) => {
    const aDate = parse(a.started_at, "yyyy-MM-dd", new Date());
    const bDate = parse(b.started_at, "yyyy-MM-dd", new Date());
    return compareDesc(aDate, bDate);
  });
  return (
    <VStack my={10}>
      <Box w={"100%"} px={4} fontSize={"lg"} fontWeight={"bold"}>
        {post.created_at} - {formatDistanceToNow(createdDate)} ago
      </Box>
      <Flex direction="row" w={"100%"}>
        <Heading as="h1" size="lg" isTruncated my={3} px={3} flex={1}>
          {post.collection.name}
        </Heading>
        {/* Collection metadata: social website etc */}
        <Stack direction={"row"} justify={"flex-end"}>
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
      <Box pt={3}>
        <Text noOfLines={show ? 0 : 2}>{post.collection.description}</Text>
        <Button size="sm" onClick={handleToggle} variant={"link"}>
          Show {show ? "Less" : "More"}
        </Button>
        <Box mt={3}>
          <Stack
            direction="row"
            justifyContent="center"
            fontSize="x-large"
            alignItems="center"
          >
            <FaRocket />
            <Heading fontSize="x-large">Inside Scoop</Heading>
            <FaRocket />
          </Stack>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Eth</Th>
                <Th>When</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderedInsights
                .slice(0, showTable ? orderedInsights.length : 3)
                .map(({ started_at, total_eth_spent, insider }) => (
                  <Tr key={insider?.id}>
                    <Td>{insider?.id}</Td>
                    <Td>{Math.round(total_eth_spent * 100) / 100}</Td>
                    <Td>{started_at}</Td>
                  </Tr>
                ))}
            </Tbody>
            {orderedInsights.length > 5 && (
              <TableCaption>
                <Button
                  onClick={() => {
                    setShowTable(!showTable);
                  }}
                >
                  {showTable ? "Less" : "More"}
                </Button>
              </TableCaption>
            )}
          </Table>
        </Box>

      </Box>
    </VStack>
  );
};

export default PostItemCard;
