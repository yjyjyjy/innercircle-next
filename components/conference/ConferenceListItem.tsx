import { Box, Text } from '@chakra-ui/react';
import { conference } from '@prisma/client';
import React from 'react';

// export type conference = {
//     id: number
//     year: number
//     conference_name: string
//     location: string | null
//     start_date: Date | null
//     end_date: Date | null
//     website: string | null
//   }
export const ConferenceListItem = ({ conference: conference }) => {
    const { id, conference_name, location, start_date, end_date, website } = conference
    return (
        <Box key={id}>
            `${conference_name}, at ${location}`
        </Box>
    )
}

