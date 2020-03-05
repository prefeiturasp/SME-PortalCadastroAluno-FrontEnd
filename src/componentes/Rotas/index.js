import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Home} from "../../paginas/Home";
import {TesteYup} from "../TesteYup";
import {Pagina404} from "../../paginas/404";

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/teste-yup" exact component={TesteYup}/>
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
}