/* eslint eqeqeq: 0 */
/* eslint-disable */
import React, {useContext, useEffect, useRef, useState} from "react";
import {useForm} from 'react-hook-form'
import InputMask from "react-input-mask";

import "./formularios.scss"
import {BtnCustomizado} from "../BtnCustomizado";
import {atualizaCadastro, buscarPalavrasImproprias} from "../../services/ConectarApi"
import {validarCPF, validarDtNascResponsavel, validarPalavrao, validaTelefoneCelular, validarDtNascEstudante} from "../../utils/ValidacoesAdicionaisFormularios";
import {NotificacaoContext} from "../../context/NotificacaoContext";
import Loading from "../../utils/Loading";
import DatePicker from "react-datepicker";
import * as moment from "moment";

import * as yup from "yup";

import {PalavroesContext} from "../../context/PalavroesContext";

export const AlteracaoCadastral = (parametros) => {

    const palavroesContext = useContext(PalavroesContext);

    yup.setLocale({
        mixed: {
            required: 'Preencha esse campo para continuar'
        },
        string: {
            email: 'Ditite um e-mail válido',
            min: 'Deve conter ${min} caracteres',
            max: 'Valor muito longo (máximo ${max} caracteres)'
        },
        number: {
            min: 'Deve conter ${min} dígitos',
            max: 'Valor inválido (deve ser menor ou igual a ${max})'
        }
    });

    const SignupSchema = yup.object().shape({
        nm_responsavel: yup.string().required("Nome do responsável é obrigatório").max(70).matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/, {
            message: 'Não são permitidos números ou caracteres especiais',
            excludeEmptyString: true
        })
        .test('test-name', 'Não é permitido repetir 03 ou mais caracteres seguidos',
            function (value) {
                return !new RegExp(/([aA-zZ])\1\1/).test(value)
            })
        .test('test-name', 'Não são permitas palavras inapropriadas',
            function (value) {
                let retorno = !validarPalavrao(value, palavroesContext.listaPalavroes)
                return retorno
            }),

        email_responsavel: yup.string().required("Email do responsável é obrigatório").email(),

        cd_ddd_celular_responsavel: yup.number().typeError("Somente números").required("DDD é obrigatório")
        .test('test-name', 'DDD deve conter 2 dígitos',
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
            }).test('test-name', 'Não são permitas palavras inapropriadas',
            function (value) {
                let retorno = !validarPalavrao(value, palavroesContext.listaPalavroes)
                return retorno
            }),
        checkboxDeclaro: yup.boolean().oneOf([true], 'Você precisa declarar que as informações são verdadeiras'),
    });

    const nmResponsavelRef = useRef();
    let datepickerRef = useRef(null);
    const {
        collapse,
        setCollapse,
        retorno_api,
        inputCodigoEol,
        inputDtNascAluno,
        setBtnDisable,
        setInputDtNascAluno,
        codigoEolRef,
        handleBtnCancelarAtualizacao,
        formEvent,
    } = parametros;

    const mensagem = useContext(NotificacaoContext);

    const {register, handleSubmit, errors} = useForm({
        mode: "onBlur",
        validationSchema: SignupSchema,
        defaultValues: {
            cd_ddd_celular_responsavel: retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel,
        },
    });

    const [loading, setLoading] = useState(false);
    const [sparErro, setSpanErro] = useState(false);
    const [dtNascResponsavel, setDtNascResponsavel] = useState(null);

    // Campos Formulário de Atualização
    const [state, setState] = useState({
        nm_responsavel: "",
        cd_cpf_responsavel: "",
        cd_ddd_celular_responsavel: "",
        nr_celular_responsavel: "",
        email_responsavel: "",
        tp_pessoa_responsavel: "",
        nome_mae: "",
        data_nascimento: "",
    });

    useEffect(() => {

        let dataApi = retorno_api.detail.responsaveis[0].data_nascimento
        let diaCorreto = null;

        if (dataApi) {
            diaCorreto = new Date(retorno_api.detail.responsaveis[0].data_nascimento);
            diaCorreto.setDate(diaCorreto.getDate() + 1);
        } else {
            diaCorreto = null;
        }
        setDtNascResponsavel(diaCorreto)

    }, [retorno_api])

    useEffect(() => {

        setState({
            ...state,
            nm_responsavel: retorno_api.detail.responsaveis[0].nm_responsavel ? retorno_api.detail.responsaveis[0].nm_responsavel.trimEnd().trimStart() : '',
            cd_cpf_responsavel: retorno_api.detail.responsaveis[0].cd_cpf_responsavel ? retorno_api.detail.responsaveis[0].cd_cpf_responsavel.trimEnd().trimStart() : '',
            email_responsavel: retorno_api.detail.responsaveis[0].email_responsavel ? retorno_api.detail.responsaveis[0].email_responsavel.trimEnd().trimStart() : '',
            cd_ddd_celular_responsavel: retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel ? retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel.trimEnd().trimStart() : '',
            nr_celular_responsavel: retorno_api.detail.responsaveis[0].nr_celular_responsavel ? retorno_api.detail.responsaveis[0].nr_celular_responsavel.trimEnd().trimStart() : '',
            tp_pessoa_responsavel: retorno_api.detail.responsaveis[0].tp_pessoa_responsavel ? String(parseInt(retorno_api.detail.responsaveis[0].tp_pessoa_responsavel)) : '',
            nome_mae: retorno_api.detail.responsaveis[0].nome_mae ? retorno_api.detail.responsaveis[0].nome_mae.trimEnd().trimStart() : '',
        });

    }, [retorno_api]);

    const handleChangeAtualizacaoCadastral = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    };
    const handleChangeDtNascResponsavel = (date) => {
        setDtNascResponsavel(date)
    }

    const handleChangeRaw = (value) => {
        const date = new Date(value.currentTarget.value);
        if (!moment(date).isValid() || validarDtNascResponsavel(date, inputDtNascAluno)) {
            setSpanErro(true);
            setDtNascResponsavel(null)
            //datepickerRef.input.focus()
        } else {
            setSpanErro(false);
        }
    };
    const handleSelect = (value) => {
        const date = new Date(value);
        if (!moment(date).isValid() || value === null || value === "") {
            setSpanErro(true);
            setDtNascResponsavel(null)
            //datepickerRef.input.focus()
        } else {
            setSpanErro(false);
        }
    }

    const handleBtnSolicitarUniforme = () => {
        return (sparErro);
    };

    const onSubmitAtualizacaoCadastral = (data, e) => {
        setLoading(true)

        // Removendo checkbox Você precisa declarar que as informações são verdadeiras
        delete data.checkboxDeclaro;

        data.nr_celular_responsavel = data.nr_celular_responsavel.replace(/ /g, '');
        data.cd_cpf_responsavel = data.cd_cpf_responsavel.replace(/-/g, "");
        data.cd_cpf_responsavel = data.cd_cpf_responsavel.replace(/\./g, '');
        data.codigo_eol_aluno = inputCodigoEol;
        data.nm_responsavel = data.nm_responsavel.trimEnd().trimStart();
        data.email_responsavel = data.email_responsavel.trimEnd().trimStart();
        data.nome_mae = data.nome_mae.trimEnd().trimStart();
        data.data_nascimento = validarDtNascEstudante(dtNascResponsavel);

        let payload_atualizado = {
            codigo_eol: inputCodigoEol,
            data_nascimento: inputDtNascAluno,
            responsavel: data
        };
        atualizaCadastro(payload_atualizado).then(retorno_api => {
            // Caso sucesso seta o focus no input codigo EOL
            codigoEolRef.current.focus();

            mensagem.setAbrirModal(true)
            mensagem.setTituloModal("Obrigado por solicitar o uniforme escolar")
            mensagem.setMsg("<p>O seu pedido do uniforme escolar já foi registrado. Nos próximos dias você receberá no e-mail cadastrado orientações sobre os próximos passos para realizar a compra nas lojas credenciadas</p>" +
                "<p>Acompanhe também as novidades sobre o novo processo de compra descentralizada pelas famílias diretamente no Portal do Uniforme: <a title='Link externo para o portal do uniforme' href='https://educacao.sme.prefeitura.sp.gov.br/portaldouniforme'>educacao.sme.prefeitura.sp.gov.br/portaldouniforme</a> </p>" +
                "<p>Atenciosamente,</p>" +
                "<p>Secretaria Municipal de Educação</p>")

            setCollapse('')
            setBtnDisable(false);
            e.target.reset();
            limpaFormulario(formEvent);
            setLoading(false);
        }).catch(error => {
            // Caso erro seta o focus no nome do responsável
            nmResponsavelRef.current.focus();
            mensagem.setAbrirModal(true)
            mensagem.setTituloModal("Erro ao solicitar uniforme")
            mensagem.setMsg("Erro ao solicitar uniforme. Tente novamente");
            console.log(error.message);
            setCollapse('show')
            setBtnDisable(true)
            setLoading(false);
        });
    }

    const limpaFormulario = () => {
        formEvent.target.reset()
        setInputDtNascAluno('')
        setState({
            ...state,
            nm_responsavel: "",
            cd_cpf_responsavel: "",
            cd_ddd_celular_responsavel: "",
            nr_celular_responsavel: "",
            email_responsavel: "",
            tp_pessoa_responsavel: "",
            nome_mae: "",
            data_nascimento: "",
            codigo_escola: "",
            codigo_dre: "",
        });
    }

    return (
        <>
            <div className={`collapse ${collapse}  pt-5`} id="">
                <h2 className="text-white mb-4">Solicitação de uniforme escolar.</h2>
                <div className='container-form-dados-responsável p-4 '>
                    <p className="mb-4">
                        <strong>Confirme ou altere os dados do responsável pelo(a) estudante</strong>
                    </p>
                    <form name="atualizacaoCadastral" onSubmit={handleSubmit(onSubmitAtualizacaoCadastral)}>
                        <div className="row">
                            <div className="col-12">
                                <label htmlFor="nm_responsavel"><strong>Nome completo do responsável (sem
                                    abreviações)*</strong></label>
                                <input
                                    ref={(e) => {
                                        register(e)
                                        nmResponsavelRef.current = e
                                    }}
                                    defaultValue={state.nm_responsavel}
                                    type="text"
                                    className="form-control"
                                    name="nm_responsavel"
                                    id="nm_responsavel"
                                />
                                {errors.nm_responsavel &&
                                <span className="text-danger mt-1">{errors.nm_responsavel.message}</span>}
                            </div>

                            <div className="col-12 col-md-8 mt-5">
                                <label htmlFor="email_responsavel"><strong>E-mail do responsável*</strong></label>
                                <input
                                    ref={(e) => {
                                        register(e)
                                    }}
                                    defaultValue={state.email_responsavel}
                                    type="email"
                                    className="form-control"
                                    name="email_responsavel"
                                    id="email_responsavel"
                                />
                                {errors.email_responsavel &&
                                <span className="text-danger mt-1">{errors.email_responsavel.message}</span>}

                            </div>
                            <div className="col-12 col-md-4 mt-5">
                                <div className="row">
                                    <div className="col-12">
                                        <label><strong>Telefone celular do responsável*</strong></label>
                                    </div>
                                    <div className="col-3">
                                        <input
                                            ref={(e) => {
                                                register(e)
                                            }}
                                            maxLength={2}
                                            defaultValue={state.cd_ddd_celular_responsavel}
                                            className="form-control"
                                            name="cd_ddd_celular_responsavel"
                                            id="cd_ddd_celular_responsavel"
                                        />
                                        {errors.cd_ddd_celular_responsavel && <span
                                            className="text-danger mt-1">{errors.cd_ddd_celular_responsavel.message}</span>}
                                    </div>
                                    <div className="col-9 pl-1">
                                        <InputMask
                                            placeholder="Somente números"
                                            mask="9 9999 9999"
                                            maskPlaceholder={null}
                                            ref={(e) => {
                                                register(e)
                                            }}
                                            onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value.replace("_", ""))}
                                            value={state.nr_celular_responsavel} type="tel" className="form-control"
                                            name="nr_celular_responsavel" id="nr_celular_responsavel"
                                        />
                                        {errors.nr_celular_responsavel && <span className="text-danger mt-1">{errors.nr_celular_responsavel.message}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-5">
                                <label><strong>Vínculo com o(a) estudante*</strong></label>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="pl-4 container-radio">
                                        <input ref={(e) => {
                                            register(e)
                                        }}
                                               onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                                               checked={state.tp_pessoa_responsavel == '1'} className="form-check-input"
                                               type="radio" name="tp_pessoa_responsavel" id="mae" value={1}/>
                                        <label className="form-check-label" htmlFor="mae"><strong>Mãe</strong></label>
                                    </div>

                                    <div className="pl-4 container-radio">
                                        <input ref={(e) => {
                                            register(e)
                                        }}
                                               onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                                               checked={state.tp_pessoa_responsavel == '2'} className="form-check-input"
                                               type="radio" name="tp_pessoa_responsavel" id="pai" value={2}/>
                                        <label className="form-check-label" htmlFor="pai"><strong>Pai</strong></label>
                                    </div>
                                    <div className="pl-4 container-radio">
                                        <input ref={(e) => {
                                            register(e)
                                        }}
                                               onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                                               checked={state.tp_pessoa_responsavel == '3'} className="form-check-input"
                                               type="radio" name="tp_pessoa_responsavel" id="responsaveLegal"
                                               value={3}/>
                                        <label className="form-check-label" htmlFor="responsaveLegal"><strong>Responsável
                                            legal</strong></label>
                                    </div>

                                    <div className="pl-4 container-radio">
                                        <input ref={register({required: true})}
                                               onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                                               checked={state.tp_pessoa_responsavel == '4'} className="form-check-input"
                                               type="radio" name="tp_pessoa_responsavel" id="alunoMaiorDeIdade"
                                               value={4}/>
                                        <label className="form-check-label" htmlFor="alunoMaiorDeIdade"><strong>Aluno
                                            maior de idade</strong></label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-12">
                                        {errors.tp_pessoa_responsavel && <span
                                            className="text-danger mt-1">{errors.tp_pessoa_responsavel.message}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <p className="fonte-maior mb-4 mt-5">
                                    <strong>Agora complete as informações do responsável pelo(a) estudante</strong>
                                </p>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12 col-md-8">
                                        <div className="row">
                                            <div className='col-12 col-md-6'>
                                                <label htmlFor="cd_cpf_responsavel"><strong>CPF do responsável*</strong></label>
                                                <InputMask
                                                    placeholder="Somente números"
                                                    mask="999.999.999-99"
                                                    //maskPlaceholder={null}
                                                    ref={(e) => {
                                                        register(e)
                                                    }}
                                                    onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value.replace("_", ""))}
                                                    value={state.cd_cpf_responsavel} type="text"
                                                    className="form-control" name="cd_cpf_responsavel"
                                                    id="cd_cpf_responsavel"/>
                                                {errors.cd_cpf_responsavel && <span
                                                    className="text-danger mt-1">{errors.cd_cpf_responsavel.message}</span>}

                                            </div>
                                            <div className='col-12 col-md-6 mt-5 mt-md-0'>
                                                <label htmlFor="data_nascimento"><strong>Data de nascimento do
                                                    responsável*</strong></label>
                                                <DatePicker
                                                    required={true}
                                                    ref={(r) => datepickerRef = r}
                                                    selected={dtNascResponsavel}
                                                    className="form-control"
                                                    onChange={(date) => handleChangeDtNascResponsavel(date)}
                                                    onChangeRaw={(e) => handleChangeRaw(e)}
                                                    onSelect={(e) => handleSelect(e)}
                                                    maxDate={new Date(inputDtNascAluno)}
                                                    //onBlur={(e)=>handleBlur(e)}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="pt"
                                                    showYearDropdown
                                                    customInput={
                                                        <InputMask
                                                            mask="99/99/9999"
                                                        />
                                                    }
                                                />
                                                <span
                                                    className="span_erro mt-1">{sparErro ? "Digite uma data Válida" : null}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-5">
                                <label htmlFor="nome_mae"><strong>Nome da mãe do responsável (sem abreviações)*</strong></label>
                                <input
                                    defaultValue={state.nome_mae}
                                    type="text"
                                    className="form-control"
                                    name="nome_mae"
                                    id="nome_mae"
                                    ref={(e) => {
                                        register(e)
                                    }}
                                />
                                {errors.nome_mae && <span className="text-danger mt-1">{errors.nome_mae.message}</span>}
                            </div>
                            <div className="col-12 mt-5">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="checkboxDeclaro"
                                        id="checkboxDeclaro" value={true}
                                        ref={(e) => {
                                            register(e)
                                        }}

                                    />
                                    <label className="form-check-label" htmlFor="checkboxDeclaro">Declaro que as informações acima são verdadeiras</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {errors.checkboxDeclaro &&<span className="text-danger mt-1">{errors.checkboxDeclaro.message}</span>}
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-4">
                            <div className='p-2'>
                                <BtnCustomizado
                                    onClick={() => handleBtnCancelarAtualizacao(formEvent)}
                                    disable=""
                                    type="reset"
                                    classeCss="btn btn-outline-primary"
                                    texto="Cancelar"
                                />
                            </div>
                            <div className='p-2'>
                                <BtnCustomizado
                                    disable={handleBtnSolicitarUniforme()}
                                    type="submit"
                                    classeCss="btn btn-primary"
                                    texto="Solicitar uniforme"
                                />
                            </div>
                        </div>
                    </form>
                    {
                        loading ? (
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        ) : null
                    }
                </div>
            </div>
        </>
    )
}