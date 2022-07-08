import { Box } from "@chakra-ui/react"
import { AdvancedImage } from "@cloudinary/react"
import { CloudinaryImage } from "@cloudinary/url-gen"
import Image from "next/image"
import React from "react"

// type Props = {
//    img: CloudinaryImage | string
// }
type Props = {
   img: string
}

const ProfilePicture: React.FC<Props> = ({ img }) => {

   return (
      <Box dropShadow="3px 10px 4px #808080">
         {/* {typeof img !== "string" ? (
            <Image

               width={100}
               height={100}
               filter="drop-shadow(3px 10px 4px #808080)"
               cldImg={img}
               alt="profile picture"
            />
         ) : ( */}
         <Image
            width={100}
            height={100}
            src={img}
            style={{
               filter: "drop-shadow(3px 10px 4px #808080)",
               objectFit: "cover",
            }}
            alt="profile picture"
         />
         {/* )} */}
      </Box>
   )
}

export default ProfilePicture