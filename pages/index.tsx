import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import prisma from '../lib/prisma';
import moment from "moment";

import PostItem from '../components/post/PostItem'
import Header from "../components/Header";
import Layout from "../components/Layout";
import { Button, Heading, Text } from "@chakra-ui/react";

// using get static props with periodical refresh/recache
export async function getStaticProps() {
  const posts = await prisma.post.findMany({
    where: { created_at: { gte: new Date("2021-08-14") } },
    include: { collection: { include: { insight: true } } },
    take: 90,
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
    },
    revalidate: 600, // In seconds
  };
}

export default ({ posts }) => {
  return (
    <>
      <Heading py={5}>
        Smart Money Feed
      </Heading>
      <Text fontSize={20} fontWeight={'bold'} py={3} color={'cyan.800'}>The NFT projects below were recently invested by smart money investors using their own ETH.</Text>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
}