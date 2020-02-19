import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {NotificacaoContextProvider} from "./context/NotificacaoContext";

ReactDOM.render(
    <NotificacaoContextProvider>
        <BrowserRouter basename="pedido-uniforme">
            <App/>
        </BrowserRouter>
    </NotificacaoContextProvider>
, document.getElementById('root'));

serviceWorker.unregister();
