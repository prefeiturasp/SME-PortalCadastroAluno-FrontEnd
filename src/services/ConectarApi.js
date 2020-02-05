const URL_API = process.env.REACT_APP_URL_API_DEV;
const TOKEN = process.env.REACT_APP_TOKEN;

export async function buscaDadosAlunoResponsavel(codigoEol, dtNascAluno) {

    const requestInfo = {
        method: "POST",
        body: JSON.stringify({
            codigo_eol: codigoEol
        }),
        headers: {
            Authorization: TOKEN,
            "Content-type": "application/json",
            Accept: "application/json"
        },
    };

    return await fetch(URL_API, requestInfo)
        .then(resposta => {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Não foi possível obter os dados");
            }
        })


}