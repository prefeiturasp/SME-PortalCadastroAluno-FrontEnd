import React from "react";

export const Home = () => {
  return (
    <div className="row">
      <div className="col-sm-6 col-10 offset-sm-3 offset-1">
        <div className="card mb-5">
          <div className="card-body">
            No Programa Auxílio Uniforme Escolar, todos os estudantes
            matriculados na Rede Municipal de Ensino (com exceção daqueles que
            estão na creche, no Ensino Médio ou na Educação de Jovens e Adultos)
            receberão o benefício, sem precisar realizar a solicitação.
            <br />
            <br />
            Para saber mais, visite o Portal do Uniforme:
            <br />
            <br />
            <a href="https://portaldeuniformes.sme.prefeitura.sp.gov.br/familia">
              https://portaldeuniformes.sme.prefeitura.sp.gov.br/familia
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
