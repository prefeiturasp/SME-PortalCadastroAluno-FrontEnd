/* eslint-disable */
import { getToken } from "./auth.service";

let URL_API = "API_URL_REPLACE_ME";

if (process.env.NODE_ENV === "development") {
  URL_API = process.env.REACT_APP_URL_API;
}

export async function buscarPalavrasImproprias() {
  const requestInfo = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  };

  return await fetch(`${URL_API}/palavras-bloqueadas/`, requestInfo).then(
    (resposta) => {
      return resposta.json();
    }
  );
}

export async function buscaDadosAlunoResponsavel(codigoEol, dtNascAluno) {
  const requestInfo = {
    method: "POST",
    body: JSON.stringify({
      codigo_eol: codigoEol,
      data_nascimento: dtNascAluno,
    }),
    headers: {
      Authorization: `JWT ${getToken()}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
  };

  return await fetch(
    `${URL_API}/dados-responsavel/busca_dados/`,
    requestInfo
  ).then((resposta) => {
    return resposta.json();
  });
}

export const getAPIVersion = async () => {
  const requestInfo = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  };
  return await fetch(`${URL_API}/versao/`, requestInfo).then((resposta) => {
    return resposta.json();
  });
};

export async function atualizaCadastro(dados) {
  const requestInfo = {
    method: "POST",
    body: JSON.stringify(dados),
    headers: {
      Authorization: `JWT ${getToken()}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
  };

  return await fetch(`${URL_API}/alunos/`, requestInfo)
    .then((resposta) => {
      return resposta;
    })
    .then((resposta_api) => {
      return resposta_api.json();
    })
    .then((resposta_api) => {
      return resposta_api[0];
    });
}
