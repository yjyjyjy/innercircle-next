import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import prisma from '../lib/prisma';
import moment from "moment";
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"

// bulid time data fetch
// export const getStaticProps: GetStaticProps = async () => {
//   const posts = await prisma.circle.findMany();
//   return { props: { posts } };
// };

// server side data fetch
export async function getServerSideProps() {
  // Get all foods in the "food" db
  const posts = await prisma.post.findMany({
    where: { created_at: { gte: new Date("2021-08-14") } },
    include: { collection: { include: { insight: true } } },
    take: 40,
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

// export default ({ posts }) => {
//   <div>{posts}</div>
// }

export default ({ posts }) => {
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <div>
            {post.collection_id}
          </div>
          <div>
            {post.created_at}
          </div>
        </div>
      ))}
    </div>
  )
}