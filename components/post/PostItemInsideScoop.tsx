import React from "react";
import { Box, Button, Heading, Stack, Table, Thead, Tbody, Tr, Th, Td, TableCaption, Link } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";
import { format, parse } from "date-fns";
type Props = {
  post: any;
};
// import NextLink from "next/link"
// import Link from "next/link";
import { ExternalLinkIcon } from '@chakra-ui/icons'



const PostItemInsideScoop: React.FC<Props> = ({ post }) => {
  const [showTable, setShowTable] = React.useState(false);
  let orderedInsights = [...post.collection.insight].sort(
    (a, b) => a.feed_importance_score > b.feed_importance_score ? -1 : 1
  ); // desc rank by feed_importance_score. Bigger feed_importance_score rank higher
  const action_dict = { "buy": "bought", "sell": "sold" }
  return (
    <Box py={5} maxW='100%' overflow='scroll'>
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
      <Box overflowX={'auto'}>
        <Table variant="simple" colorScheme={'facebook'} fontSize={['xs', 'md']} size={'sm'}>
          <Thead>
            <Tr >
              <Th>Address</Th>
              <Th>Action</Th>
              <Th>Num Token</Th>
              <Th>For Eth Amount</Th>
              <Th>Last Traded At</Th>
              <Th>Still Owns</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orderedInsights
              .slice(0, showTable ? orderedInsights.length : 3)
              .map(
                ({
                  insider_id,
                  action,
                  num_tokens,
                  total_eth_amount,
                  last_traded_at,
                  num_tokens_owned,
                  insider
                }) => (
                  <Tr key={insider_id + ':' + action}>
                    <Td>
                      <Link href={`/profile/${insider_id}`} isExternal>
                        <Button variant={'link'} fontSize={['xs', 'md']}>
                          {insider.opensea_display_name ||
                            `${insider_id.substring(0, 3)}...${insider_id.substring(insider_id.length - 3, insider_id.length)}`}
                          <ExternalLinkIcon mx={[0, 2]} />
                        </Button>
                      </Link>
                    </Td>
                    <Td>{action_dict[action]}</Td>
                    <Td>{num_tokens}</Td>
                    <Td>{Math.round(total_eth_amount * 100) / 100} ETH</Td>
                    <Td>{format(parse(last_traded_at.substring(0, 10), "yyyy-MM-dd", new Date()), "MMM-d-yyyy")}</Td>
                    <Td>{num_tokens_owned}</Td>
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
    </Box >
  );
};

export default PostItemInsideScoop;
