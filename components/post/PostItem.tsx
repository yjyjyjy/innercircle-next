import React from "react";
import { Heading, VStack, Link } from "@chakra-ui/react";
// import Link from "next/link";
import { formatDistanceToNow, parse } from "date-fns";
import PostItemCollectionInfo from "./PostItemCollectionInfo";
import PostItemInsideScoop from "./PostItemInsideScoop";
type Props = {
  post: any;
};
const PostItem: React.FC<Props> = ({ post }) => {
  const createdDate = parse(post.created_at, "yyyy-MM-dd", new Date());
  return (
    <VStack py={10}>
      {/* <Box w={"100%"} px={4} fontSize={"lg"} fontWeight={"bold"}>
        {post.created_at} - {formatDistanceToNow(createdDate)} ago
      </Box> */}
      <Link href={`/collection/${post.collection.id}`} isExternal={true}>
        <Heading as='h1'>
          {post.collection.name}
        </Heading>
      </Link>
      <PostItemCollectionInfo collection={post.collection} />
      <PostItemInsideScoop collection={post.collection} />
    </VStack >
  );
};

export default PostItem;
