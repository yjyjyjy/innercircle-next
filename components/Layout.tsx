import React, { ReactNode } from "react";
import Header from "./Header";
import { Container } from "@chakra-ui/react";
type Props = {
    children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
    <div>
        <Header />
        <Container maxW="container.xl">
            <div className="layout">{props.children}</div>
        </Container>
    </div>
);

export default Layout;