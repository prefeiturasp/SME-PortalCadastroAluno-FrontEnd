import React from 'react';

import "./assets/css/styles.scss"
import Rotas from "./componentes/Rotas";
import MenuPrincipal from "./componentes/Menu/MenuPrincipal";
import MenuAcessibilidade from "./componentes/Menu/MenuAcessibilidade";
import Rodape from "./componentes/Rodape/Rodape";

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            alterarFonte:
                (localStorage.getItem("alterarFonte") &&
                    localStorage.getItem("alterarFonte") === "true") ||
                false,
            alterarContraste:
                (localStorage.getItem("alterarContraste") &&
                    localStorage.getItem("alterarContraste") === "true") ||
                false,

            esconderLinkBuscaEscola:true

        };
        this.alterarFonte = this.alterarFonte.bind(this);
        this.alterarContraste = this.alterarContraste.bind(this);
    }

    alterarFonte() {
        const alterarFonte =
            localStorage.getItem("alterarFonte") !== null
                ? localStorage.getItem("alterarFonte") !== "true"
                : true;
        localStorage.setItem("alterarFonte", alterarFonte);
        this.setState({ alterarFonte });
    }

    alterarContraste() {
        const alterarContraste =
            localStorage.getItem("alterarContraste") !== null
                ? localStorage.getItem("alterarContraste") !== "true"
                : true;
        localStorage.setItem("alterarContraste", alterarContraste);
        this.setState({ alterarContraste });
    }

    render() {
        const { alterarFonte, alterarContraste } = this.state;
        return (
            <section role="main" className={`${alterarFonte && "fonte-maior"} ${alterarContraste && "alto-contraste"}`}>
                <MenuAcessibilidade alterarFonte={this.alterarFonte} alterarContraste={this.alterarContraste}/>
                <MenuPrincipal  />
                <Rotas/>
                <Rodape/>
            </section>

        );
    }
}

export default App;
