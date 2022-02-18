import { useRouter } from "next/router";
import { Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
const User = () => {
    const router = useRouter()
    const { id } = router.query;
    return (
        <>
            <Heading as={"h1"}>🚧🚧🚧 User Page is under construction</Heading>
            <Text py={4}>wallet address: {id}</Text>
            <Link href={"/"}><Button>Go Back</Button></Link>
        </>
    )

}

export default User;