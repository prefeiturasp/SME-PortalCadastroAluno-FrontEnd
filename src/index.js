import * as Sentry from "@sentry/browser";
import React from "react";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { NotificacaoContextProvider } from "./context/NotificacaoContext";
import { PalavroesContextProvider } from "./context/PalavroesContext";
import * as serviceWorker from "./serviceWorker";

if (process.env.IS_DOCKER_ENVIRONMENT === true) {
  const SENTRY_URL = "SENTRY_URL_REPLACE_ME";
  Sentry.init({ dsn: SENTRY_URL });
}

ReactDOM.render(
  <NotificacaoContextProvider>
    <PalavroesContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PalavroesContextProvider>
  </NotificacaoContextProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
