import Head from "next/head";
import "../styles/globals.css";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import { store } from "../src/store/store";
import { Provider, red } from "react-redux";
import { useEffect } from "react";
import { callsListener } from "../src/utils/firebase.utils";

const progress = new ProgressBar({
  size: 4,
  color: "blue",
  className: "z-50",
  delay: 0,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Help | Desk</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default MyApp;
