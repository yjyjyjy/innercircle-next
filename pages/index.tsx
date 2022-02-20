import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import prisma from '../lib/prisma';
import moment from "moment";

import PostItem from '../components/post/PostItem'
import Header from "../components/Header";
import Layout from "../components/Layout";
import { Heading, Text } from "@chakra-ui/react";

// server side data fetch
export async function getServerSideProps() {
  // Get all foods in the "food" db
  const posts = await prisma.post.findMany({
    where: { created_at: { gte: new Date("2021-08-14") } },
    include: { collection: { include: { insight: true } } },
    take: 25,
    orderBy: { created_at: 'desc' }
  });

  // return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)).map((post) => {
        return {
          ...post,
          created_at: moment(post.created_at).format("YYYY-MM-DD")
        }
      })
    }
  };
}

export default ({ posts }) => {
  return (
    <>
      <Heading py={5}>
        Smart Money Feed
      </Heading>
      <Text fontSize={20} fontWeight={'bold'} border='2px' p={3} borderRadius={10} borderColor={'cyan.500'} color={'cyan.900'}>The new NFT projects invested by smart money investors using their own ETH. Click on the smart money wallet addresses under "Inside Scoop" to explore more.</Text>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
}