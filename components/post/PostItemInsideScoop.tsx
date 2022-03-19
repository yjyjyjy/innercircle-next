import React from "react";
import { Box, Button, Heading, Stack, Table, Thead, Tbody, Tr, Th, Td, TableCaption } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";
import { format, parse } from "date-fns";
type Props = {
  post: any;
};
import Link from "next/link";

const PostItemInsideScoop: React.FC<Props> = ({ post }) => {
  const [showTable, setShowTable] = React.useState(false);
  const orderedInsights = [...post.collection.insight].sort((a, b) => a.total_eth_spent > b.total_eth_spent ? -1 : 1);
  return (
    <Box mt={5}>
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
            <Th>Total Eth Spent</Th>
            <Th>When</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orderedInsights
            .slice(0, showTable ? orderedInsights.length : 3)
            .map(({ started_at, total_eth_spent, insider_id }) => (
              <Tr key={insider_id}>
                <Td><Link href={`/profile/${insider_id}`}>{`${insider_id.substring(0, 3)}...${insider_id.substring(insider_id.length - 3, insider_id.length)}`}</Link></Td>
                <Td>{Math.round(total_eth_spent * 100) / 100} ETH</Td>
                {/* <Td>{format(parse(started_at.substring(0, 10), "yyyy-MM-dd", new Date()), "MMM-d-yyyy")}</Td> */}
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
  );
};

export default PostItemInsideScoop;
