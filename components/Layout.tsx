import React, { ReactNode } from "react";
import Header from "./Header";
import { Container, Box, useMediaQuery } from "@chakra-ui/react";
type Props = {
    children: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
    const [isLargerThan1280] = useMediaQuery('(min-width: 1290px)')
    return (
        <div>
            <Header />
            {isLargerThan1280 ?
                <Container
                    maxW="container.xl"
                    pt={'75px'}>
                    <div className="layout">{props.children}</div>
                </Container> :
                <Box
                    pt={'75px'}
                    px={'7px'}>
                    <div className="layout">{props.children}</div>
                </Box>
            }

        </div>)
}


export default Layout;