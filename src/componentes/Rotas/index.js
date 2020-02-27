import React from "react";
import {Route, Switch} from 'react-router-dom'

import {Home} from "../../paginas/Home";
export const Rotas = () => {
    return(
        <Switch>
            <Route path="/" exact component={Home}/>
        </Switch>
    )
}