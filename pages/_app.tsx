import type { AppProps } from "next/app";

import Head from "next/head";
import { Provider } from "react-redux";
import SSRProvider from "react-bootstrap/SSRProvider";
import Container from "react-bootstrap/Container";
import { Toaster } from "react-hot-toast";

import TopNav from "components/layout/TopNav";
import { store } from "config/store";
import { WalletContextProvider } from "contexts/WalletContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <SSRProvider>
        <WalletContextProvider>
          <div>
            <Head>
              <title>Palm User Authentication</title>
              <meta name="description" content="User authentication and profile" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
          </div>
          <div className="position-relative">
            <Toaster position="top-center" reverseOrder={false} />
            <TopNav />
            <main className="main flex-grow-1 py-3">
              <Container>
                <Component {...pageProps} />
              </Container>
            </main>
          </div>
        </WalletContextProvider>
      </SSRProvider>
    </Provider>
  );
}

export default MyApp;
