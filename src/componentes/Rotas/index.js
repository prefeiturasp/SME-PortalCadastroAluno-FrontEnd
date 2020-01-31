import React from "react";
import {Route, Switch} from 'react-router-dom'

import {Home} from "../../paginas/Home";
import {AtualizeCadastro} from "../../paginas/AtualizeCadastro";

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/atualize-seu-cadastro" exact component={AtualizeCadastro}/>
        </Switch>
    )
}