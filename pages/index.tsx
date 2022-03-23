import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import prisma from '../lib/prisma';
import moment from "moment";

import PostItem from '../components/post/PostItem'
import { Button, Heading, Text } from "@chakra-ui/react";

// using get static props with periodical refresh/recache
export async function getStaticProps() {
  const posts = await prisma.post.findMany({
    where: { created_at: { gte: new Date("2021-08-14") } },
    include: {
      collection: {
        include: {
          insight: {
            include: {
              insider: true
            }
          }
        }
      }
    },
    take: 100,
    orderBy: { feed_importance_score: 'desc' }
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
    revalidate: 600, // Frequency to refresh this on the server in seconds
  };
}

export default ({ posts }) => {
  console.log(posts[0])
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