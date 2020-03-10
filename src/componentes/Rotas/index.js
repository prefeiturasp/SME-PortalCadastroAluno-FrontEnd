import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Home} from "../../paginas/Home";
import {Pagina404} from "../../paginas/404";

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
}