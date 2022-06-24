import { Box } from '@chakra-ui/react'
import { AdvancedImage } from '@cloudinary/react'
import { CloudinaryImage } from '@cloudinary/url-gen'
import Image from 'next/image'
import React from 'react'

type Props = {
   img: CloudinaryImage | string
}

const ProfilePicture: React.FC<Props> = ({ img }) => {
   return (
      <Box dropShadow="3px 10px 4px #808080">
         {typeof img !== 'string' ? (
            <AdvancedImage
               objectFit={'cover'}
               width={100}
               height={100}
               filter="drop-shadow(3px 10px 4px #808080)"
               cldImg={img}
            />
         ) : (
            <Image width={100} height={100} src={img} />
         )}
      </Box>
   )
}

export default ProfilePicture
