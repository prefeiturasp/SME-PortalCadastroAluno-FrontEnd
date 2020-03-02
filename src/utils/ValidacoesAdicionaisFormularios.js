import * as moment from 'moment'

export const validarPalavrao = (arrayValidar, listaPalavroes) => {

    arrayValidar = arrayValidar.toLowerCase();
    const arrayValidarSplit = arrayValidar.split(' ');

    const result = arrayValidarSplit.filter((item)=>{
        return listaPalavroes.indexOf(item) > -1
    });

    if (result.length > 0 ) {
        return true
    }else {
        return false;
    }
}

export const validaDDD = value => {
    let numero = value
        .replace(/_/g, "");
    if (numero.length < 2 ){
        return false
    }else {
        return true;
    }
}

export const validaTelefoneCelular = value => {
    let numero = value
        .replace(/ /g, "")
        .replace(/_/g, "");
    if (numero.length < 9 ){
        return false
    }else {
        return true;
    }
    //return numero.length >= 10 ? undefined : "Necessário um telefone valido!";
};

export const validarDtNascEstudante = (dataNascEstudante) =>{
    return moment(dataNascEstudante).format("YYYY-MM-DD")
}

export const validarDtNascResponsavel = (dataNascResponsavel, dataNascAluno)=>{
    if (moment(dataNascAluno).isAfter(dataNascResponsavel)){
        return false;
    }else{
        return true;
    }
};

export const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");

    if (cpf === "") return false;
    // Elimina CPFs invalidos conhecidos
    if (
        cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999"
    ){
        return false;
    }

    // Valida 1o digito
    let add = 0;
    let i, rev;
    for (i = 0; i < 9; i++){
        add += parseInt(cpf.charAt(i)) * (10 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11){
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(9))){
        return false;
    }
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++){
        add += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11){
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(10))){
        return false;
    }

    return true;
};