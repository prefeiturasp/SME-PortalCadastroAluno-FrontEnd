import React, { useState, useEffect } from "react";

import "./assets/css/styles.scss";
import { Rotas } from "./componentes/Rotas";
import { MenuPrincipal } from "./componentes/Menu/MenuPrincipal";
import { MenuAcessibilidade } from "./componentes/Menu/MenuAcessibilidade";
import { Rodape } from "./componentes/Rodape/Rodape";
import { login, getToken } from "./services/auth.service";

export const App = () => {
  const [alterarFonte, setAlterarFonte] = useState("");
  const [alterarContraste, setAlterarConstraste] = useState("");

  const handleFonte = () => {
    setAlterarFonte(!alterarFonte);
  };

  const handleConstraste = () => {
    setAlterarConstraste(!alterarContraste);
  };

  useEffect(() => {
    if (!getToken()) {
      login();
    }
  });

  return (
    <section
      role="main"
      className={`${alterarFonte && "fonte-maior"} ${alterarContraste &&
        "alto-contraste"}`}
    >
      <MenuAcessibilidade
        handleFonte={handleFonte}
        handleConstraste={handleConstraste}
      />
      <MenuPrincipal />
      <Rotas />
      <Rodape />
    </section>
  );
};
