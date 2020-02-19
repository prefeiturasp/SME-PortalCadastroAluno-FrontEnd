const URL_API = process.env.REACT_APP_URL_API;
const URL_API_BUSCA_DADOS = process.env.REACT_APP_URL_API_BUSCA_DADOS_DEV;
const URL_API_ATUALIZA_CADASTRO = process.env.REACT_APP_URL_API_ATUALIZAR_CADASTRO_DEV;
const TOKEN = process.env.REACT_APP_TOKEN;


export async function buscaPalavrasImproprias() {

    return await fetch(`${URL_API}/palavras-bloqueadas/`)
        .then(resposta => {
            return resposta.json();
        });
}

export async function buscaDadosAlunoResponsavel(codigoEol, dtNascAluno) {

    const requestInfo = {
        method: "POST",
        body: JSON.stringify({
            codigo_eol: codigoEol,
            data_nascimento: dtNascAluno,
        }),
        headers: {
            Authorization: TOKEN,
            "Content-type": "application/json",
            Accept: "application/json"
        },
    };

    return await fetch(URL_API_BUSCA_DADOS, requestInfo)
        .then(resposta => {
            return resposta.json();
        });
}

export async function atualizaCadastro(dados) {

    const requestInfo = {
        method: "POST",
        body: JSON.stringify(dados),
        headers: {
            Authorization: TOKEN,
            "Content-type": "application/json",
            Accept: "application/json"
        },
    };

    return await fetch(URL_API_ATUALIZA_CADASTRO, requestInfo)
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Não foi possível obter os dados");
            }
        })
}