/* eslint eqeqeq: 0 */
/* eslint-disable */
import React, {useContext, useEffect, useRef, useState} from "react";
import {useForm} from 'react-hook-form'
import InputMask from "react-input-mask";

import "./formularios.scss"
import {BtnCustomizado} from "../BtnCustomizado";
import {atualizaCadastro, buscarPalavrasImproprias} from "../../services/ConectarApi"
import {validarCPF, validarDtNascResponsavel, validarPalavrao, validaTelefoneCelular, validaDDD } from "../../utils/ValidacoesAdicionaisFormularios";
import {NotificacaoContext} from "../../context/NotificacaoContext";
import Loading from "../../utils/Loading";

export const AlteracaoCadastral = (parametros) => {

    const nmResponsavelRef = useRef();

    const {
        collapse,
        setCollapse,
        retorno_api,
        inputCodigoEol,
        inputDtNascAluno,
        setBtnDisable,
        setInputCodigoEol,
        setInputDtNascAluno,
        codigoEolRef,
        handleBtnCancelarAtualizacao,
    } = parametros;

    const mensagem = useContext(NotificacaoContext);

    const {register, handleSubmit, errors} = useForm({
        mode: "onBlur"
    });

    const [palavroes, setPalavroes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Campos Formulário de Atualização
    const [state, setState] = useState({
        nm_responsavel: "",
        cd_cpf_responsavel: "",
        cd_ddd_celular_responsavel: "",
        nr_celular_responsavel: "",
        email_responsavel: "",
        tp_pessoa_responsavel: "",
        //dc_tipo_responsavel: "",
        nome_mae: "",
        data_nascimento: "",
    });

    useEffect(() => {

        setState({
            ...state,
            nm_responsavel: retorno_api.detail.responsaveis[0].nm_responsavel ? retorno_api.detail.responsaveis[0].nm_responsavel.trimEnd().trimStart() : '',
            cd_cpf_responsavel: retorno_api.detail.responsaveis[0].cd_cpf_responsavel ? retorno_api.detail.responsaveis[0].cd_cpf_responsavel.trimEnd().trimStart() : '',
            email_responsavel: retorno_api.detail.responsaveis[0].email_responsavel ? retorno_api.detail.responsaveis[0].email_responsavel.trimEnd().trimStart() : '',
            cd_ddd_celular_responsavel: retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel ? retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel.trimEnd().trimStart() : '',
            nr_celular_responsavel: retorno_api.detail.responsaveis[0].nr_celular_responsavel ? retorno_api.detail.responsaveis[0].nr_celular_responsavel.trimEnd().trimStart() : '',
            tp_pessoa_responsavel: retorno_api.detail.responsaveis[0].tp_pessoa_responsavel ? String(parseInt(retorno_api.detail.responsaveis[0].tp_pessoa_responsavel)) : '',
            // dc_tipo_responsavel: retorno_api.detail.responsaveis[0].dc_tipo_responsavel ? retorno_api.detail.responsaveis[0].dc_tipo_responsavel : '',
            nome_mae: retorno_api.detail.responsaveis[0].nome_mae ? retorno_api.detail.responsaveis[0].nome_mae.trimEnd().trimStart() : '',
            data_nascimento: retorno_api.detail.responsaveis[0].data_nascimento ? retorno_api.detail.responsaveis[0].data_nascimento.trimEnd().trimStart() : '',
        });

    }, [retorno_api]);

    useEffect(() => {
        buscarPalavrasImproprias()
            .then(listaPalavroes => {
                setPalavroes(listaPalavroes);
            });

    }, [])

    const handleChangeAtualizacaoCadastral = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
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

        let payload_atualizado = {
            codigo_eol: inputCodigoEol,
            data_nascimento: inputDtNascAluno,
            responsavel: data
        };

        atualizaCadastro(payload_atualizado)

            .then(retorno_api => {
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
                limpaFormulario();

                setLoading(false);

            })
            .catch(error => {
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

        setInputCodigoEol('')
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
                                <label htmlFor="nm_responsavel"><strong>Nome completo do responsável (sem abreviações)*</strong></label>
                                <input
                                    ref={(e) => {
                                        register(e, {
                                                required: true,
                                                pattern: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/,
                                                maxLength: 70,
                                                validate: {
                                                    naoRepetirCaracteres: valor => !new RegExp(/([aA-zZ])\1\1/).test(valor),
                                                    validaPalavrao: valor => !validarPalavrao(valor, palavroes),
                                                }
                                            }
                                        )
                                        nmResponsavelRef.current = e
                                    }

                                    } onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.nm_responsavel} type="text" className="form-control" name="nm_responsavel" id="nm_responsavel"/>
                                {errors.nm_responsavel && errors.nm_responsavel.type === "required" &&
                                <span className="span_erro mt-1">Nome é obrigatório</span>}
                                {errors.nm_responsavel && errors.nm_responsavel.type === "naoRepetirCaracteres" &&
                                <span className="span_erro mt-1">Não é permitido repetir 03 ou mais caracteres seguidos</span>}
                                {errors.nm_responsavel && errors.nm_responsavel.type === "pattern" &&
                                <span className="span_erro mt-1">Não são permitidos números ou caracteres especiais</span>}
                                {errors.nm_responsavel && errors.nm_responsavel.type === "validaPalavrao" &&
                                <span className="span_erro mt-1">Não são permitas palavras inapropriadas</span>}
                                {errors.nm_responsavel && errors.nm_responsavel.type === "maxLength" &&
                                <span className="span_erro mt-1">Permitido até 70 caracteres</span>}

                            </div>

                            <div className="col-12 col-md-8 mt-5">
                                <label htmlFor="email_responsavel"><strong>E-mail do responsável*</strong></label>
                                <input ref={
                                    register({
                                        required: true,
                                        maxLength: 50,
                                        validate: {
                                            emailValido: valor => new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/).test(valor),
                                        }

                                    })} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.email_responsavel} type="email" className="form-control" name="email_responsavel" id="email_responsavel"/>
                                {errors.email_responsavel && errors.email_responsavel.type === "required" &&
                                <span className="span_erro mt-1">Email é obrigatório</span>}
                                {errors.email_responsavel && errors.email_responsavel.type === "emailValido" &&
                                <span className="span_erro mt-1">Digite um email válido</span>}
                                {errors.email_responsavel && errors.email_responsavel.type === "maxLength" &&
                                <span className="span_erro mt-1">Permitido até 50 caracteres</span>}
                            </div>

                            <div className="col-12 col-md-4 mt-5">
                                <div className="row">
                                    <div className="col-12">
                                        <label><strong>Telefone celular do responsável*</strong></label>
                                    </div>
                                    <div className="col-3">
                                        <InputMask
                                            mask="99"
                                            //maskPlaceholder={null}
                                            ref={register({
                                                required: true,
                                                //minLength: 2,
                                                validate: {
                                                    validaDDD: valor => validaDDD(valor)
                                                }
                                            })} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value.replace("_", ""))} value={state.cd_ddd_celular_responsavel} type="text" className="form-control" name="cd_ddd_celular_responsavel" id="cd_ddd_celular_responsavel"/>
                                        {errors.cd_ddd_celular_responsavel && errors.cd_ddd_celular_responsavel.type === 'required' &&
                                        <span className="span_erro mt-1">DDD é obrigatório</span>}
                                        {errors.cd_ddd_celular_responsavel && errors.cd_ddd_celular_responsavel.type === 'validaDDD' &&
                                        <span className="span_erro mt-1">DDD deve conter 2 números</span>}

                                    </div>
                                    <div className="col-9 pl-1">
                                        <InputMask
                                            placeholder="Somente números"
                                            mask="9 9999 9999"
                                            //maskPlaceholder={null}
                                            ref={
                                                register({
                                                    required: true,
                                                    //minLength: 9,
                                                    validate: {
                                                        validaTelefoneCelular: valor => validaTelefoneCelular(valor),
                                                    }
                                                })} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value.replace("_", ""))} value={state.nr_celular_responsavel} type="tel" className="form-control" name="nr_celular_responsavel" id="nr_celular_responsavel"/>
                                        {errors.nr_celular_responsavel && errors.nr_celular_responsavel.type === "required" &&
                                        <span className="span_erro mt-1">Celular é obrigatório</span>}
                                        {errors.nr_celular_responsavel && errors.nr_celular_responsavel.type === "validaTelefoneCelular" &&
                                        <span className="span_erro mt-1">Celular deve conter 9 números</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-5">
                                <label><strong>Vínculo com o(a) estudante*</strong></label>
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div className="pl-4 container-radio">
                                        <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '1'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="mae" value={1}/>
                                        <label className="form-check-label" htmlFor="mae"><strong>Mãe</strong></label>
                                    </div>

                                    <div className="pl-4 container-radio">
                                        <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '2'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="pai" value={2}/>
                                        <label className="form-check-label" htmlFor="pai"><strong>Pai</strong></label>
                                    </div>
                                    <div className="pl-4 container-radio">
                                        <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '3'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="responsaveLegal" value={3}/>
                                        <label className="form-check-label" htmlFor="responsaveLegal"><strong>Responsável legal</strong></label>
                                    </div>

                                    <div className="pl-4 container-radio">
                                        <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '4'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="alunoMaiorDeIdade" value={4}/>
                                        <label className="form-check-label" htmlFor="alunoMaiorDeIdade"><strong>Aluno maior de idade</strong></label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-12">
                                        {errors.tp_pessoa_responsavel &&
                                        <span className="span_erro mt-1">Vínculo com o(a) estudante é obrigatório</span>}
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
                                                    ref={
                                                        register({
                                                            validate: {
                                                                validarCpf: async cpf => await validarCPF(cpf)
                                                            }
                                                        })} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value.replace("_", ""))} value={state.cd_cpf_responsavel} type="text" className="form-control" name="cd_cpf_responsavel" id="cd_cpf_responsavel"/>
                                                {errors.cd_cpf_responsavel && errors.cd_cpf_responsavel.type === "validarCpf" &&
                                                <span className="span_erro mt-1">Digite um CPF válido</span>}
                                            </div>

                                            <div className='col-12 col-md-6 mt-5 mt-md-0'>
                                                <label htmlFor="data_nascimento"><strong>Data de nascimento do responsável*</strong></label>
                                                <input
                                                    ref={
                                                        register({
                                                            required: true,
                                                            maxLength: 10,
                                                            validate: {
                                                                comparaDatas: data => !validarDtNascResponsavel(data, inputDtNascAluno)
                                                            }
                                                        })} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.data_nascimento} type="date" className="form-control" name="data_nascimento" id="data_nascimento" max="9999-12-31"/>
                                                {errors.data_nascimento && errors.data_nascimento.type === "required" &&
                                                <span className="span_erro mt-1">Data de nascimento do responsável é obrigatório</span>}
                                                {errors.data_nascimento && errors.data_nascimento.type === "comparaDatas" &&
                                                <span className="span_erro mt-1">Digite uma data de nascimento válida</span>}
                                                {errors.dtNascAluno && errors.dtNascAluno.type === "maxLength" &&
                                                <span className="span_erro text-white mt-1">Digite uma data Válida</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-5">
                                <label htmlFor="nome_mae"><strong>Nome da mãe do responsável (sem abreviações)*</strong></label>
                                <input
                                    ref={
                                        register({
                                                required: true,
                                                pattern: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/,
                                                maxLength: 70,
                                                validate: {
                                                    naoRepetirCaracteres: valor => !new RegExp(/([aA-zZ])\1\1/).test(valor),
                                                    validaPalavrao: valor => !validarPalavrao(valor, palavroes),
                                                }
                                            }
                                        )
                                    } onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.nome_mae} type="text" className="form-control" name="nome_mae" id="nome_mae"/>
                                {errors.nome_mae && errors.nome_mae.type === "required" &&
                                <span className="span_erro mt-1">Nome de mãe de responsável é obrigatório</span>}
                                {errors.nome_mae && errors.nome_mae.type === "naoRepetirCaracteres" &&
                                <span className="span_erro mt-1">Não é permitido repetir 03 ou mais caracteres seguidos</span>}
                                {errors.nome_mae && errors.nome_mae.type === "pattern" &&
                                <span className="span_erro mt-1">Não são permitidos números ou caracteres especiais</span>}
                                {errors.nome_mae && errors.nome_mae.type === "validaPalavrao" &&
                                <span className="span_erro mt-1">Não são permitas palavras inapropriadas</span>}
                                {errors.nome_mae && errors.nome_mae.type === "maxLength" &&
                                <span className="span_erro mt-1">Permitido até 70 caracteres</span>}


                            </div>

                            <div className="col-12 mt-5">
                                <div className="form-check form-check-inline">
                                    <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} className="form-check-input" type="checkbox" name="checkboxDeclaro" id="checkboxDeclaro" value="sim"/>
                                    <label className="form-check-label" htmlFor="checkboxDeclaro">Declaro que as informações acima são verdadeiras</label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {errors.checkboxDeclaro && <span className="span_erro mt-1">Você precisa declarar que as informações são verdadeiras</span>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <div className='p-2'>
                                <BtnCustomizado
                                    onClick={(e) => handleBtnCancelarAtualizacao(e)}
                                    disable=""
                                    type="reset"
                                    classeCss="btn btn-outline-primary"
                                    texto="Cancelar"
                                />
                            </div>
                            <div className='p-2'>
                                <BtnCustomizado
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