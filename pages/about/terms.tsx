import { Box } from '@chakra-ui/react';
import React from 'react';

const terms = () => {
    return (
        <Box>
            <iframe src="https://v1.embednotion.com/embed/a675c82976eb455ea56c2b48f3e73564"></iframe>
            <style jsx>{`
            iframe {width: 100%; height: 600px; border: 2px solid #ccc; border-radius: 10px; padding: none; }
            `}</style>
        </Box>
    );
};

export default terms;