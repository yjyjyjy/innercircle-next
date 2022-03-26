import { Flex, Image, Text, Button, Stack, Box, Heading, Link } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import { format } from "date-fns";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useMediaQuery } from '@chakra-ui/react'
import PostItemCollectionInfo from "../../components/post/PostItemCollectionInfo";



// server side data fetch
export async function getServerSideProps(context) {
  const { id } = context.query;
  const collection = await prisma.collection.findUnique({
    where: { id: id.toLowerCase() as string }
  });
  console.log(id)
  console.log(collection)

  return {
    props: {
      collection: JSON.parse(JSON.stringify(collection)),
    },
  };
}

const dateFormatter = (timestamp: number) => {
  const dateStr = format(new Date(timestamp), "MMM/dd");
  return dateStr;
};

const Collection = ({ collection }) => {
  const [isBigScreen] = useMediaQuery('(min-width: 500px)')
  console.log(collection)

  return (
    <Stack direction={'column'} maxW={'100%'}>
      <PostItemCollectionInfo collection={collection} />
      <Link href={"/"}>
        <Button>
          Go Back
        </Button>
      </Link>

    </Stack >
  );
};
//  <ExternalLinkIcon mx={[0, 2]} />
export default Collection;
