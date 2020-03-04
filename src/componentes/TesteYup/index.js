import React, {useState, useEffect, useContext} from "react";
import {useForm} from "react-hook-form";
import InputMask from "react-input-mask";
import * as yup from "yup";

import "../Formularios/formularios.scss"

import {validarPalavrao} from "../../utils/ValidacoesAdicionaisFormularios";

import {PalavroesContext} from "../../context/PalavroesContext";

export const TesteYup = () => {

    const palavroesContext = useContext(PalavroesContext);
    const [inputCodigoEol, setInputCodigoEol] = useState("");

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
    });

    const SignupSchema = yup.object().shape({

        codigoEol: yup.number().typeError('Campo EOL precisa ser numérico').required("Campo código EOL é obrigatório"),

        nm_responsavel: yup.string().required("Nome do Responsável é obrigatório").max(70).matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/, {
            message: 'Não são permitidos números ou caracteres especiais',
            excludeEmptyString: true
        }).test('test-name', 'Não é permitido repetir 03 ou mais caracteres seguidos',
            function (value) {
                return !new RegExp(/([aA-zZ])\1\1/).test(value)
            }).test('test-name', 'Não são permitidos PALAVROES',
            function (value) {
                let retorno = !validarPalavrao(value, palavroesContext.listaPalavroes)
                return retorno
            })
    });

    const {register, handleSubmit, errors} = useForm({
        validationSchema: SignupSchema,
    });
    const onSubmit = data => {
        alert(JSON.stringify(data));
    };


    return (
        <div className="container">

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-12">
                        <label>Código Eol</label>
                        <input
                            name="codigoEol"
                            className="form-control"
                            //mask="9999999999"
                            //maskPlaceholder={null}
                            placeholder="Somente números"
                        />
                        {errors.codigoEol && <span className="text-danger mt-1">{errors.codigoEol.message}</span>}
                    </div>
                    <div className="col-12 mt-2">
                        <label htmlFor="nm_responsavel">Nome completo do responsável (sem abreviações)*</label>
                        <input
                            className="form-control"
                            name="nm_responsavel"
                            id="nm_responsavel"
                            onChange={e => setInputCodigoEol(e.target.value.trim())}
                            value={inputCodigoEol}

                            ref={(e) => {
                                register(e)
                            }}

                        />
                        {errors.nm_responsavel && <span className="text-danger mt-1">{errors.nm_responsavel.message}</span>}
                    </div>
                    <div className='p-2'>
                        <input className="btn btn-primary" type="submit"/>
                    </div>
                </div>
            </form>

        </div>
    );
}
