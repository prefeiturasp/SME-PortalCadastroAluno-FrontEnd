import * as moment from 'moment'
import * as yup from "yup";
import {PalavroesContext} from "../context/PalavroesContext";
import {useContext} from "react";


export const YupSignupSchemaLogin = yup.object().shape({
    codigoEol: yup.number().typeError('Campo EOL precisa ser numérico').required("Campo código EOL é obrigatório"),
});

export const YupSignupSchemaCadastro = () => {

    const palavroesContext = useContext(PalavroesContext);

    return (
        yup.object().shape({
            nm_responsavel: yup.string().required("Nome do responsável é obrigatório")
            .max(70, "Nome do responsável deve conter no máximo 70 caracteres")
            .matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/, {
                message: 'Não são permitidos números ou caracteres especiais',
                excludeEmptyString: true
            }).test('test-name', 'Não é permitido repetir 03 ou mais caracteres seguidos',
                function (value) {
                    return !new RegExp(/([aA-zZ])\1\1/).test(value)
                })
            .test('test-name', 'Não são permitas palavras inapropriadas',
                function (value) {
                    let retorno = !validarPalavrao(value, palavroesContext.listaPalavroes)
                    return retorno
                }),

            nao_possui_email: yup.boolean(),

            email_responsavel: yup
            .string()
            .when("nao_possui_email", {
                is: false,
                then: yup.string().required("E-mail do responsável é obrigatório").email("Digite um email válido")
                .test('test-name', 'Esse não parece ser um e-mail válido. Tente novamente',
                    function (value) {
                        return !validarDominioEmail(value)
                    }),
            }),

            email_responsavel_confirm: yup
            .string()
            .when("nao_possui_email", {
                is: false,
                then: yup.string().required("Confirmação do e-mail é obrigatória").email("Digite um email válido")
                .test('test-name', 'E-mail diferente',
                    function (value) {
                        const { email_responsavel } = this.parent;
                        return !validarStringsIguais(email_responsavel, value)
                    }),
            }),

            nao_possui_celular: yup.boolean(),

            cd_ddd_celular_responsavel: yup
            .string()
            .when("nao_possui_celular", {
                is: false,
                then: yup.string().required("DDD é obrigatório")
                .test('test-name', 'DDD deve conter 2 dígitos',
                    function (value) {
                        return new RegExp(/^\d{2}$/).test(value)
                    })
            }),

            nr_celular_responsavel: yup
            .string()
            .when("nao_possui_celular", {
                is: false,
                then: yup.string().required("Celular é obrigatório")
                .test('test-name', 'Celular deve conter 9 números',
                    function (value) {
                        return validaTelefoneCelular(value)
                    }),
            }),

            tp_pessoa_responsavel: yup.number().required("Vínculo com o estudante é obrigatório"),

            cd_cpf_responsavel: yup.string().required("CPF do responsável é obrigatório")
            .test('test-name', 'Digite um CPF válido',
                function (value) {
                    return validarCPF(value)
                }),

            nome_mae: yup.string().required("Nome da mãe do responsável é obrigatório")
            .max(70, "Nome da mãe do responsável deve conter no máximo 70 caracteres")
            .matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/, {
                message: 'Não são permitidos números ou caracteres especiais',
                excludeEmptyString: true
            }).test('test-name', 'Não é permitido repetir 03 ou mais caracteres seguidos',
                function (value) {
                    return !new RegExp(/([aA-zZ])\1\1/).test(value)
                })
            .test('test-name', 'Não são permitas palavras inapropriadas',
                function (value) {
                    let retorno = !validarPalavrao(value, palavroesContext.listaPalavroes)
                    return retorno
                })
            .test('test-name', 'Aqui você deve digitar o nome da sua mãe',
                function (value) {
                    const { nm_responsavel } = this.parent;
                    return validarStringsIguais(nm_responsavel, value)
                }),

            checkboxDeclaro: yup.boolean().oneOf([true], 'Você precisa declarar que as informações são verdadeiras'),
        })
    )
}

export const validarStringsIguais = (string1, string2) => {
    string1 = string1.toLowerCase().replace(/ /g, "");
    string2 = string2.toLowerCase().replace(/ /g, "");
    return string1 === string2 ? false : true;
}

export const validarDominioEmail = (email) => {
    let dominiosInvalidos = ["gmil","gmal", "gmail.com.br", "yahhoo", "yahho", "outlok"]
    const result = dominiosInvalidos.filter((item) => {
        return email.indexOf(item) > -1
    });
    return result.length > 0;

}

export const validarPalavrao = (arrayValidar, listaPalavroes) => {
    arrayValidar = arrayValidar.toLowerCase();
    const arrayValidarSplit = arrayValidar.split(' ');
    const result = arrayValidarSplit.filter((item) => {
        return listaPalavroes.indexOf(item) > -1
    });

    return result.length > 0;
}

export const validaTelefoneCelular = value => {
    let numero = value.replace(/ /g, "").replace(/_/g, "");
    if (numero.length < 9) {
        return false
    } else {
        return true;
    }
};

export const validarDtNascEstudante = (dataNascEstudante) => {
    return moment(dataNascEstudante).format("YYYY-MM-DD")
}

export const validarDtNascResponsavel = (dataNascResponsavel, dataNascAluno) => {

    dataNascResponsavel = moment(dataNascResponsavel).format("YYYY-DD-MM")
    dataNascAluno = moment(dataNascAluno).format("YYYY-MM-DD")

    if (moment(dataNascAluno).isAfter(dataNascResponsavel)) {
        return false;
    } else {
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
    ) {
        return false;
    }

    // Valida 1o digito
    let add = 0;
    let i, rev;
    for (i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(9))) {
        return false;
    }
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
};