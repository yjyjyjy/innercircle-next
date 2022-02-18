import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import prisma from '../lib/prisma';
import moment from "moment";

import PostItem from '../components/post/PostItem'
import Header from "../components/Header";
import Layout from "../components/Layout";

// server side data fetch
export async function getServerSideProps() {
  // Get all foods in the "food" db
  const posts = await prisma.post.findMany({
    where: { created_at: { gte: new Date("2021-08-14") } },
    include: { collection: { include: { insight: true } } },
    take: 30,
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
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
}