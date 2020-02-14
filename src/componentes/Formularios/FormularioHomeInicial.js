import React, {useState, useRef, useContext} from "react";
import {useForm} from 'react-hook-form'
import InputMask from "react-input-mask";

import "./formularios.scss"
import {BtnCustomizado} from "../BtnCustomizado";
import {buscaDadosAlunoResponsavel, atualizaCadastro} from "../../services/ConectarApi"
import {NotificacaoContext} from "../../context/NotificacaoContext";

export const FormularioHomeInicial = () => {

    const mensagem = useContext(NotificacaoContext);

    const {register, handleSubmit, errors} = useForm()

    const [inputCodigoEol, setInputCodigoEol] = useState('');
    const [inputDtNascAluno, setInputDtNascAluno] = useState('');
    const [collapse, setCollapse] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);

    // Campos Formulário de Atualização
    const [state, setState] = useState({
        nm_responsavel: "",
        cd_cpf_responsavel: "",
        cd_ddd_celular_responsavel: "",
        nr_celular_responsavel: "",
        email_responsavel: "",
        dc_tipo_responsavel: "",
        nome_mae: "",
        data_nascimento: "",
    });

    const handleBtnAAbrirFormularioDisable = () => {

        if (btnDisable === true || inputCodigoEol === '' || inputDtNascAluno === '') {
            return true;
        } else {
            return false;
        }
    }

    const handleChangeAtualizacaoCadastral = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    };

    const handleBtnCancelarAtualizacao = () => {
        setCollapse('');
        setBtnDisable(false);
        limpaFormularios();

    }

    const onSubmitAbrirFormulario = (e) => {
        e.preventDefault()

        buscaDadosAlunoResponsavel(inputCodigoEol, inputDtNascAluno)
            .then(retorno_api => {

                console.log("buscaDadosAlunoResponsavel ", retorno_api)

                setCollapse('show');
                setBtnDisable(true);
                setAtualizaCampos(retorno_api);
            })
            .catch(error => {
                //setMsg("Dados inválidos, tente novamente");
                mensagem.setAbrirModal(true)
                mensagem.setTituloModal("Dados inválidos, tente novamente")
                mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento")
                setCollapse('');
                setBtnDisable(false);
                console.log(error.message);
                limpaFormularios();
            });
    }

    const onSubmitAtualizacaoCadastral = (data, e) => {

        console.log("Ollyver ", data)

        // Removendo checkbox Você precisa declarar que as informações são verdadeiras
        delete data.checkboxDeclaro;

        let payload_atualizado = {
            codigo_eol: inputCodigoEol,
            data_nascimento: inputDtNascAluno,
            responsavel: data
        };

        atualizaCadastro(payload_atualizado)
            .then(retorno_api => {
                mensagem.setAbrirModal(true)
                mensagem.setTituloModal("Obrigado pela atualização cadastral!")
                mensagem.setMsg("Obrigado por fazer sua atualização cadastral. Se precisar rever algum dado até o dia XX/XX, basta entrar novamente no formulário e corrigir os dados enviados.\n" +
                    "Em breve a Secretaria Municipal de Educação fará novo contato, com mais informações sobre como se dará o processo de compra dos uniformes escolares pelas famílias.")

            })
            .catch(error => {
                mensagem.setAbrirModal(true)
                mensagem.setTituloModal("ATUALIZAR CADASTRO ERRO")
                mensagem.setMsg("ATUALIZAR CADASTRO ERRO - BODY")
                console.log(error.message);
            });

        setCollapse('')
        setBtnDisable(false)
        e.target.reset();
       limpaFormularios();
    }

    const setAtualizaCampos = (retorno_api) => {

        setState({
            ...state,
            nm_responsavel: retorno_api.detail.responsaveis[0].nm_responsavel ? retorno_api.detail.responsaveis[0].nm_responsavel : '',
            cd_cpf_responsavel: retorno_api.detail.responsaveis[0].cd_cpf_responsavel ? retorno_api.detail.responsaveis[0].cd_cpf_responsavel : '',
            email_responsavel: retorno_api.detail.responsaveis[0].email_responsavel ? retorno_api.detail.responsaveis[0].email_responsavel : '',
            cd_ddd_celular_responsavel: retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel ? retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel : '',
            nr_celular_responsavel: retorno_api.detail.responsaveis[0].nr_celular_responsavel ? retorno_api.detail.responsaveis[0].nr_celular_responsavel : '',
            dc_tipo_responsavel: retorno_api.detail.responsaveis[0].dc_tipo_responsavel ? retorno_api.detail.responsaveis[0].dc_tipo_responsavel : '',
            nome_mae: retorno_api.detail.responsaveis[0].nome_mae ? retorno_api.detail.responsaveis[0].nome_mae : '',
            data_nascimento: retorno_api.detail.responsaveis[0].data_nascimento ? retorno_api.detail.responsaveis[0].data_nascimento : '',
        });
    }

    const limpaFormularios = () => {
        setInputCodigoEol('')
        setInputDtNascAluno('')

        setState({
            ...state,
            nm_responsavel: "",
            cd_cpf_responsavel: "",
            cd_ddd_celular_responsavel: "",
            nr_celular_responsavel: "",
            email_responsavel: "",
            dc_tipo_responsavel: "",
            nome_mae: "",
            data_nascimento: "",
        });

    }

    return (
        <div className="w-100 formulario-inicial-home pt-5 pb-5 ">
            <div className="container">
                <h2 className="text-white mb-xs-5">Acesse o formulário para solicitar o crédito.</h2>

                <form onSubmit={(e) => onSubmitAbrirFormulario(e)} name="abrirFormulario" id='abrirFormulario'>
                    <div className="row">
                        <div className="col-lg-4 mt-4">
                            <label id="codigoEol">Código EOL</label>
                            <input onChange={(e) => setInputCodigoEol(e.target.value)} value={inputCodigoEol} name="codigoEol" type="text" className="form-control" placeholder="Digite código EOL"/>
                        </div>
                        <div className="col-lg-4 mt-4">
                            <label htmlFor='dtNascAluno'>Data de nascimento do estudante</label>
                            <input onChange={(e) => setInputDtNascAluno(e.target.value)} value={inputDtNascAluno} id="dtNascAluno" type="date" className="form-control"/>
                        </div>
                        <div className="col-lg-4 mt-4 mt-md-5 pl-5 pr-5 pl-md-0 pr-md-0">

                            <BtnCustomizado
                                disable={handleBtnAAbrirFormularioDisable()}
                                type="submit"
                                classeCss="btn btn-outline-primary btn-block btn-abrir-formulario mt-2"
                                texto="Abrir formulário"
                            />
                        </div>
                    </div>
                </form>

                <div className={`collapse ${collapse}  pt-5`} id="">
                    <h2 className="text-white mb-4">Solicitação do crédito </h2>

                    <div className='container-form-dados-responsável p-4 '>
                        <p className="mb-4">
                            <strong>Confirme ou altere os dados do responsável pelo(a) estudante</strong>
                        </p>
                        <form name="atualizacaoCadastral" onSubmit={handleSubmit(onSubmitAtualizacaoCadastral)}>
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="nm_responsavel"><strong>Nome completo do responsável (sem abreviações)*</strong></label>
                                    <input
                                        ref={
                                            register({
                                                    required: true,
                                                    pattern: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/,
                                                    validate: {
                                                        naoRepetirCaracteres: valor => !new RegExp(/([aA-zZ])\1\1/).test(valor),
                                                    }
                                                }
                                            )
                                        } onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.nm_responsavel} type="text" className="form-control" name="nm_responsavel" id="nm_responsavel"/>
                                    {errors.nm_responsavel && errors.nm_responsavel.type === "required" &&
                                    <span className="span_erro mt-1">O campo Nome é obrigatório</span>}
                                    {errors.nm_responsavel && errors.nm_responsavel.type === "naoRepetirCaracteres" &&
                                    <span className="span_erro mt-1">Não é permitido repetir 03 ou mais caracteres seguidos</span>}
                                    {errors.nm_responsavel && errors.nm_responsavel.type === "pattern" &&
                                    <span className="span_erro mt-1">Não são permitidos números</span>}

                                </div>

                                <div className="col-12 col-md-8 mt-5">
                                    <label htmlFor="email_responsavel"><strong>E-mail do responsável*</strong></label>
                                    <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.email_responsavel} type="email" className="form-control" name="email_responsavel" id="email_responsavel"/>
                                    {errors.email_responsavel &&
                                    <span className="span_erro mt-1">O campo Email é obrigatório</span>}

                                </div>

                                <div className="col-12 col-md-4 mt-5">
                                    <div className="row">
                                        <div className="col-12">
                                            <label><strong>Telefone celular do responsável*</strong></label>
                                        </div>
                                        <div className="col-3">
                                            <InputMask
                                                mask="99"
                                                ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.cd_ddd_celular_responsavel} type="text" className="form-control" name="cd_ddd_celular_responsavel" id="cd_ddd_celular_responsavel"/>
                                            {errors.cd_ddd_celular_responsavel &&
                                            <span className="span_erro mt-1">O campo DDD é obrigatório</span>}
                                        </div>
                                        <div className="col-9 pl-1">
                                            <InputMask
                                                mask="999999999"
                                                ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.nr_celular_responsavel} type="tel" className="form-control" name="nr_celular_responsavel" id="nr_celular_responsavel"/>
                                            {errors.nr_celular_responsavel &&
                                            <span className="span_erro mt-1">O campo Celular é obrigatório</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-5">
                                    <label><strong>Vínculo com o(a) estudante*</strong></label>
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.dc_tipo_responsavel == 'MAE'} className="form-check-input" type="radio" name="dc_tipo_responsavel" id="mae" value="MAE"/>
                                            <label className="form-check-label" htmlFor="mae"><strong>Mãe</strong></label>
                                        </div>

                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.dc_tipo_responsavel == 'PAI'} className="form-check-input" type="radio" name="dc_tipo_responsavel" id="pai" value="PAI"/>
                                            <label className="form-check-label" htmlFor="pai"><strong>Pai</strong></label>
                                        </div>
                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.dc_tipo_responsavel == 'RESPONSAVEL_LEGAL'} className="form-check-input" type="radio" name="dc_tipo_responsavel" id="responsaveLegal" value="RESPONSAVEL_LEGAL"/>
                                            <label className="form-check-label" htmlFor="responsaveLegal"><strong>Responsável legal</strong></label>
                                        </div>

                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.dc_tipo_responsavel == 'ALUNO_MAIOR_DE_IDADE'} className="form-check-input" type="radio" name="dc_tipo_responsavel" id="alunoMaiorDeIdade" value="ALUNO MAIOR DE IDADE"/>
                                            <label className="form-check-label" htmlFor="alunoMaiorDeIdade"><strong>Aluno maior de idade</strong></label>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-12">
                                            {errors.dc_tipo_responsavel &&
                                            <span className="span_erro mt-1">O campo Vínculo com o(a) estudante é obrigatório</span>}
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
                                                    <label htmlFor="cd_cpf_responsavel"><strong>Cpf do responsável*</strong></label>
                                                    <InputMask
                                                        mask="99999999999"
                                                        ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.cd_cpf_responsavel} type="text" className="form-control" name="cd_cpf_responsavel" id="cd_cpf_responsavel"/>
                                                        {errors.cd_cpf_responsavel &&
                                                    <span className="span_erro mt-1">O campo Cpf do responsável é obrigatório</span>}
                                                </div>

                                                <div className='col-12 col-md-6 mt-5 mt-md-0'>
                                                    <label htmlFor="data_nascimento"><strong>Data de nascimento do responsável*</strong></label>
                                                    <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.data_nascimento} type="date" className="form-control" name="data_nascimento" id="data_nascimento"/>
                                                    {errors.data_nascimento &&
                                                    <span className="span_erro mt-1">O campo Data de nascimento do responsável é obrigatório</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-5">
                                    <label htmlFor="nome_mae"><strong>Nome de mãe de responsável (sem abreviações)*</strong></label>
                                    <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.nome_mae} type="text" className="form-control" name="nome_mae" id="nome_mae"/>
                                    {errors.nome_mae &&
                                    <span className="span_erro mt-1">O campo Nome de mãe de responsável é obrigatório</span>}
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
                                    {errors.checkboxDeclaro &&
                                    <span className="span_erro mt-1">Você precisa declarar que as informações são verdadeiras</span>}
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
                                        texto="Atualizar cadastro"
                                    />
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}