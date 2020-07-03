import React from "react";
import logoEducacaoSP from "../../assets/img/educacao_sp.png";
import "./menu-principal.scss";

export const MenuPrincipal = () => {
  return (
    <div className="container">
      <div className="row mt-4 mb-4">
        <div className="col-lg-3 col-sm-12 d-flex justify-content-lg-start justify-content-center align-items-end mb-4 mb-lg-0">
          <h1 className="m-0">
            <a href="https://educacao.sme.prefeitura.sp.gov.br/">
              <img
                src={logoEducacaoSP}
                alt="Escola Aberta"
                className="img-fluid"
              />
            </a>
          </h1>
        </div>
        <div
          id="menu-principal"
          className="col-lg-9 col-sm-12 links-menu d-flex flex-wrap  align-items-end justify-content-lg-end justify-content-start pr-lg-0 mb-xs-4"
        >
          <ul className="nav nav-tabs border-0">
            <li className="nav-item">
              <a href="https://portaldeuniformes.sme.prefeitura.sp.gov.br/familia">
                <button className="nav-link text-secondary mb-1 pb-0">
                  Busque loja credenciada
                </button>
              </a>
            </li>

            <li className="nav-item">
              <a
                title="Link externo para avise sobre problemas"
                className="nav-link text-secondary mb-1 pb-0"
                href="https://sp156.prefeitura.sp.gov.br/portal/servicos/informacao?servico=3616"
              >
                Avise sobre problemas
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
