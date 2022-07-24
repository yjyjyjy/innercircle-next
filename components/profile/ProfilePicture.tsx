import { Box } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

type Props = {
   img: string
}

const ProfilePicture: React.FC<Props> = ({ img }) => {
   return (
      <Box dropShadow="3px 10px 4px #808080">
         <Image
            width={100}
            height={100}
            src={img}
            style={{
               filter: 'drop-shadow(3px 10px 4px #808080)',
               objectFit: 'cover',
            }}
            alt="profile picture"
         />
      </Box>
   )
}

export default ProfilePicture
