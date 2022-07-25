import { Box } from '@chakra-ui/react';
import React from 'react';

const privacy = () => {
    return (
        <Box>
            <iframe src="https://v1.embednotion.com/embed/ccebc78059ea4541b6dab2ba77ab4385"></iframe>
            <style jsx>{`
            iframe {width: 100%; height: 600px; border: 2px solid #ccc; border-radius: 10px; padding: none; }
            `}</style>
        </Box>
    );
};

export default privacy;