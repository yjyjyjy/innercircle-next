import { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import Layout from "../components/Layout";
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Head>
        <title>innerCircle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
