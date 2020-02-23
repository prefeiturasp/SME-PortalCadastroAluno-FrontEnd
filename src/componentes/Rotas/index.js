import React from "react";
import {Route, Switch} from 'react-router-dom'

import {Home} from "../../paginas/Home";

import TesteFocus from "../Formularios/TesteFocus";

export const Rotas = () => {
    return(
        <Switch>
            <Route basename="/" path="/" exact component={Home}/>
            <Route path="/teste-focus" exact component={TesteFocus}/>
        </Switch>
    )
}