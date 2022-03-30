import React from "react";
import { Heading, VStack, Link } from "@chakra-ui/react";

type Props = {
    post: any;
};
const PostItem: React.FC<Props> = ({ post }) => {
    return (
        <VStack py={10}>
            <Link href={`/collection/${post.collection.id}`} isExternal={true}>
                <Heading as='h1'>
                    {post.collection.name}
                </Heading>
            </Link>

        </VStack >
    );
};

export default PostItem;
