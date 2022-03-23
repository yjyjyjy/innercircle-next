import { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import Layout from "../components/Layout";
import Head from 'next/head'
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";

const App = ({ Component, pageProps }: AppProps) => {
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const router = useRouter();
  // useEffect(() => {
  //   const handleStart = () => {
  //     setIsLoading(true);
  //   };
  //   const handleComplete = () => {
  //     setIsLoading(false);
  //   };

  //   router.events.on('routeChangeStart', handleStart);
  //   router.events.on('routeChangeComplete', handleComplete);
  //   router.events.on('routeChangeError', handleComplete);
  // }, [router]);



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
