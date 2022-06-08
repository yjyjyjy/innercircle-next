import { Center } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import MemberProfileCard from "../../components/profile/MemberProfileCard";

// server side data fetch
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { handle } = context.query;
  const user_profile = await prisma.user_profile.findUnique({
    where: { handle: handle as string },
  });

  return {
    props: {
      user_profile,
    },
  };
};

const User = ({ user_profile }) => {

  return (
    <Center>
      <MemberProfileCard user_profile={user_profile} />
    </Center>
  );
};

export default User;
