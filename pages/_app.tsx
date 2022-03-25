import { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import Layout from "../components/Layout";
import Head from 'next/head'
// import '../styles/globals.css'
import Script from "next/script";
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
      <Script
        strategy='lazyOnload'
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_GOOGLE_ANALYTICS}`} />
      <Script
        strategy='lazyOnload'>
        {
          `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.NEXT_GOOGLE_ANALYTICS}');`
        }
      </Script>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
