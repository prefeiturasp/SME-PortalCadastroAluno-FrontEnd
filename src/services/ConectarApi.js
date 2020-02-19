const URL_API = process.env.REACT_APP_URL_API;
const TOKEN = process.env.REACT_APP_TOKEN;


export async function buscarPalavrasImproprias() {

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

    return await fetch(`${URL_API}/dados-responsavel/busca_dados/`, requestInfo)
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

    return await fetch(`${URL_API}/alunos/`, requestInfo)
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Não foi possível obter os dados");
            }
        })
}