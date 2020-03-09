import * as moment from 'moment'
import * as yup from "yup";
import {PalavroesContext} from "../context/PalavroesContext";
import {useContext} from "react";

// Validações yup schema
export const yupSetLocaleLogin = () => (

    yup.setLocale({
        mixed: {
            required: 'Preencha esse campo para continuar'
        },
        string: {
            email: 'Preencha um e-mail válido',
            min: 'Valor muito curto (mínimo ${min} caracteres)',
            max: 'Valor muito longo (máximo ${max} caracteres)'
        },
        number: {
            min: 'Valor inválido (deve ser maior ou igual a ${min})',
            max: 'Valor inválido (deve ser menor ou igual a ${max})'
        }
    })
)

export const yupSignupSchemaLogin = yup.object().shape({
    codigoEol: yup.number().typeError('Campo EOL precisa ser numérico').required("Campo código EOL é obrigatório"),
});

export const yupSetLocaleCadastro = () => (

    yup.setLocale({
        mixed: {
            required: 'Preencha esse campo para continuar'
        },
        string: {
            email: 'Digite um e-mail válido',
            min: 'Deve conter ${min} caracteres',
            max: 'Valor muito longo (máximo ${max} caracteres)'
        },
        number: {
            min: 'Deve conter ${min} dígitos',
            max: 'Valor inválido (deve ser menor ou igual a ${max})'
        }
    })
)

export const SignupSchemaCadastro = () => {

    const palavroesContext = useContext(PalavroesContext);

    return (
        yup.object().shape({
            nm_responsavel: yup.string().required("Nome do responsável é obrigatório").max(70).matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/, {
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

            email_responsavel: yup.string().required("Email do responsável é obrigatório").email(),

            cd_ddd_celular_responsavel: yup.number().typeError("Somente números").required("DDD é obrigatório").test('test-name', 'DDD deve conter 2 dígitos',
                function (value) {
                    return new RegExp(/^\d{2}$/).test(value)
                }),

            nr_celular_responsavel: yup.string().required("Celular é obrigatório").test('test-name', 'Celular deve conter 9 números',
                function (value) {
                    return validaTelefoneCelular(value)
                }),

            tp_pessoa_responsavel: yup.number().required(),

            cd_cpf_responsavel: yup.string().required().test('test-name', 'Digite um CPF válido',
                function (value) {
                    return validarCPF(value)
                }),

            nome_mae: yup.string().required("Nome da mãe do responsável é obrigatório").max(70).matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/, {
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
            checkboxDeclaro: yup.boolean().oneOf([true], 'Você precisa declarar que as informações são verdadeiras'),
        })
    )
}

export const validarPalavrao = (arrayValidar, listaPalavroes) => {

    arrayValidar = arrayValidar.toLowerCase();
    const arrayValidarSplit = arrayValidar.split(' ');

    const result = arrayValidarSplit.filter((item) => {
        return listaPalavroes.indexOf(item) > -1
    });

    if (result.length > 0) {
        return true
    } else {
        return false;
    }
}

export const validaDDD = value => {
    let numero = value.replace(/_/g, "");
    if (numero.length < 2) {
        return false
    } else {
        return true;
    }
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