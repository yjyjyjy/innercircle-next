import { Button, Stack, Heading, Link } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import { format } from "date-fns";
import PostItemCollectionInfo from "../../components/post/PostItemCollectionInfo";
import PostItemInsideScoop from "../../components/post/PostItemInsideScoop";
import CollectionBackers from "../../components/collection/CollectionBackers";
import { GetServerSideProps } from "next";

// server side data fetch
export const getServerSideProps: GetServerSideProps = async (context) => {
  let { id } = context.query;
  if (typeof id === "object") {
    id = id[0];
  }

  const collection = await prisma.collection.findUnique({
    where: { id: id.toLowerCase() as string },
    include: {
      insight: {
        include: {
          insider: true,
        },
      },
      insider_collection_ownership: {
        include: {
          insider: true,
        },
      },
    },
  });

  return {
    props: {
      collection: JSON.parse(JSON.stringify(collection)),
    },
  };
};

const dateFormatter = (timestamp: number) => {
  const dateStr = format(new Date(timestamp), "MMM/dd");
  return dateStr;
};

const Collection = ({ collection }) => {
  return (
    <Stack mt={4} direction={"column"} maxW={"100%"}>
      <Link href={"/"}>
        <Button>Back to Feed</Button>
      </Link>
      <Heading as="h1">{collection.name}</Heading>
      <PostItemCollectionInfo collection={collection} />
      <PostItemInsideScoop collection={collection} />
      <CollectionBackers
        insiderCollectionOwnership={collection.insider_collection_ownership}
      />
      <Link href={"/"}>
        <Button>Back to Feed</Button>
      </Link>
    </Stack>
  );
};

export default Collection;
