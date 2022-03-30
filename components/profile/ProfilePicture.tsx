import { Box, Image } from "@chakra-ui/react";
import React from "react";

type Props = {
  image_url: string;
};

const ProfilePicture: React.FC<Props> = ({ image_url }) => {
  return (

    <Box
      borderRadius={"50%"}
      overflow="hidden"
      border="2px"
      borderColor={"white"}
      width={100}
      height={100}
      dropShadow='3px 10px 4px #808080'
      zIndex={1}
    >
      <Image
        src={image_url || '/default_gray.png'} // under public folder
        objectFit={'cover'}
        width={100}
        height={100}
        filter="drop-shadow(3px 10px 4px #808080)"
        zIndex={-1}
      />
    </Box>
  );
};

export default ProfilePicture;

