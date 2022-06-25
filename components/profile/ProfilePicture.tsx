import { Box, Image } from '@chakra-ui/react'
import React from 'react'

type Props = {
   image_url: string
}

const ProfilePicture: React.FC<Props> = ({ image_url }) => {
   return (
      <Box dropShadow="3px 10px 4px #808080">
         <Image
            src={image_url || '/default_gray.png'} // under public folder
            objectFit={'cover'}
            width={100}
            height={100}
            filter="drop-shadow(3px 10px 4px #808080)"
            alt="profile photo"
         />
      </Box>
   )
}

export default ProfilePicture
