import React from "react";
import { Heading, VStack, Box, Stack, Grid, GridItem } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import ProfilePicture from "../profile/ProfilePicture";


type Props = {
    insiderCollectionOwnership: any[];
};
const CollectionBackers: React.FC<Props> = ({ insiderCollectionOwnership }) => {
    console.log('YOOOOo')
    console.log(insiderCollectionOwnership)
    let orderedInsiderOwnership = [...insiderCollectionOwnership].sort(
        (a, b) => a.num_tokens > b.num_tokens ? -1 : 1
    );
    return (
        <VStack py={10}>
            <Heading>HEY</Heading>
            <Grid templateColumns='repeat(3, 1fr)' gap={3}>
                {orderedInsiderOwnership.map(i =>
                    <GridItem key={i.insider_id}>
                        {i.insider_id}, {i.num_tokens}
                        <ProfilePicture image_url={i.insider.opensea_image_url} />
                    </GridItem>
                )}
            </Grid>
        </VStack >
    );
};

export default CollectionBackers;
