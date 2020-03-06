import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {NotificacaoContextProvider} from "./context/NotificacaoContext";
import {PalavroesContextProvider} from "./context/PalavroesContext"

import { NotificacaoContextProvider } from "./context/NotificacaoContext";

if (process.env.IS_DOCKER_ENVIRONMENT === true) {
  const SENTRY_URL = "SENTRY_URL_REPLACE_ME";
  Sentry.init({ dsn: SENTRY_URL });
}

ReactDOM.render(
    <NotificacaoContextProvider>
        <PalavroesContextProvider>
            <BrowserRouter basename="/pedido-uniforme">
                <App/>
            </BrowserRouter>
        </PalavroesContextProvider>
    </NotificacaoContextProvider>
    , document.getElementById('root'));

serviceWorker.unregister();
