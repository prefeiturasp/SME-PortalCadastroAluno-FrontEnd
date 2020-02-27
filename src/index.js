import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {NotificacaoContextProvider} from "./context/NotificacaoContext";
import {LoadingContextProvider} from "./context/LoadingContext";

ReactDOM.render(
    <NotificacaoContextProvider>
        <LoadingContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </LoadingContextProvider>
    </NotificacaoContextProvider>
, document.getElementById('root'));

serviceWorker.unregister();
