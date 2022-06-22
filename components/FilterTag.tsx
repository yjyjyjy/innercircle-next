import { Box, Tag, TagLabel } from '@chakra-ui/react'

export const FilterTag = ({
   label,
   startDate = null,
   isChecked = false,
   colorTheme = 'blue',
   onClick,
}) => (
   <Box p={2}>
      <Tag
         size={'lg'}
         onClick={onClick}
         variant={isChecked ? 'solid' : 'outline'}
         colorScheme={colorTheme}
         _hover={{ cursor: 'pointer', bg: colorTheme + '.100' }}
      >
         <TagLabel>
            {label}
            {startDate && ' (' + startDate + ')'}
         </TagLabel>
      </Tag>
   </Box>
)
