import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/Layout'
import Head from 'next/head'
import Script from 'next/script'
import * as gtag from '../lib/gtag'
import { SessionProvider } from 'next-auth/react'
// import from ''
import { AppContextProvider } from './AppContext'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
   return (
      <AppContextProvider>
         <SessionProvider session={session}>
            <ChakraProvider>
               <Head>
                  <title>innerCircle</title>
                  <meta
                     name="viewport"
                     content="width=device-width, initial-scale=1"
                  />
                  <link
                     rel="icon"
                     type="image/png"
                     sizes="32x32"
                     href="/favicon-32x32.png"
                  />
               </Head>
               <Script
                  strategy="afterInteractive"
                  src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
               />
               <Script
                  id="gtag-init"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                     __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                  }}
               />
               <Layout>
                  <Component {...pageProps} />
               </Layout>
            </ChakraProvider>
         </SessionProvider>
      </AppContextProvider>
   )
}

export default App
