import React, {useState, useRef} from "react";
import "./formularios.scss"
import {BtnCustomizado} from "../BtnCustomizado";
import {buscaDadosAlunoResponsavel} from "../../services/ConectarApi"

import {useForm} from 'react-hook-form'

export const FormularioHomeInicial = () => {

    const {register, handleSubmit, watch, errors, reset} = useForm()

    //console.log(watch('example2')) // watch input value by passing the name of it

    const myForm = useRef(null)
    const [inputCodigoEol, setInputCodigoEol] = useState('');
    const [inputDtNascAluno, setInputDtNascAluno] = useState('');
    const [collapse, setCollapse] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);

    // Campos Formulário de Atualização
    const [state, setState] = useState({
        nm_responsavel: "",
        email_responsavel: "",
        cd_ddd_celular_responsavel: "",
        nr_celular_responsavel: "",
        tp_pessoa_responsavel: "",
        cd_cpf_responsavel: "",
        dt_nasc_responsavel: "",
        nm_mae_responsavel: "",
        checkbox_declaro: "",
    });

    const setAtualizaCampos = (retorno_api) => {
        console.log("Ollyver setAtualizaCampos | ", retorno_api);

        setState({
            ...state,
            nm_responsavel: retorno_api.detail.responsaveis[0].nm_responsavel ? retorno_api.detail.responsaveis[0].nm_responsavel : '',
            email_responsavel: retorno_api.detail.responsaveis[0].email_responsavel ? retorno_api.detail.responsaveis[0].email_responsavel : '',
            cd_ddd_celular_responsavel: retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel ? retorno_api.detail.responsaveis[0].cd_ddd_celular_responsavel : '',
            nr_celular_responsavel: retorno_api.detail.responsaveis[0].nr_celular_responsavel ? retorno_api.detail.responsaveis[0].nr_celular_responsavel : '',
            tp_pessoa_responsavel: retorno_api.detail.responsaveis[0].tp_pessoa_responsavel ? retorno_api.detail.responsaveis[0].tp_pessoa_responsavel : '',
            cd_cpf_responsavel: retorno_api.detail.responsaveis[0].cd_cpf_responsavel ? retorno_api.detail.responsaveis[0].cd_cpf_responsavel : '',
            dt_nasc_responsavel: retorno_api.detail.responsaveis[0].dt_nasc_responsavel ? retorno_api.detail.responsaveis[0].dt_nasc_responsavel : '',
            nm_mae_responsavel: retorno_api.detail.responsaveis[0].nm_mae_responsavel ? retorno_api.detail.responsaveis[0].nm_mae_responsavel : '',
            checkbox_declaro: retorno_api.detail.responsaveis[0].checkbox_declaro ? retorno_api.detail.responsaveis[0].checkbox_declaro : '',
        });
    }

    const handleChangeAtualizacaoCadastral = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    };

    const handleBtnAbrirCadastro = (statusCollapse, statusBtnDisable, retornar_dados) => {

        setCollapse(statusCollapse)
        setBtnDisable(statusBtnDisable)

        if (retornar_dados) {
            buscaDadosAlunoResponsavel(inputCodigoEol, inputDtNascAluno)
                .then(retorno_api => {
                    setAtualizaCampos(retorno_api);
                })
                .catch(error => {
                    console.log(error.message);
                });
        }
    }

    const handleBtnAAbrirFormularioDisable = () => {
        if (btnDisable === true || inputCodigoEol === '' || inputDtNascAluno === '') {
            return true
        } else {
            return false
        }
    }

    const handleSubmit_local = (e) => {
        const formData = new FormData(e.target)
        const campos = {}

        e.preventDefault()

        for (let entry of formData.entries()) {
            campos[entry[0]] = entry[1]
        }

        console.log(campos); // reference by form input's `name` tag

        /*fetch('/api/form-submit-url', {
            method: 'POST',
            body: data,
        });*/
    }

    const onSubmit = (data, e ) => {

        console.log(data)

        e.target.reset()

        /*setState({
            nm_responsavel: '',
            email_responsavel: '',
            cd_ddd_celular_responsavel: '',
            nr_celular_responsavel: '',
            tp_pessoa_responsavel: '',
            cd_cpf_responsavel: '',
            dt_nasc_responsavel: '',
            nm_mae_responsavel: '',
            checkbox_declaro: '',
        });*/

        /*fetch('/api/form-submit-url', {
           method: 'POST',
           body: data,
       });*/

    }


    return (
        <div className="w-100 formulario-inicial-home pt-5 pb-5 ">
            <div className="container">
                <h2 className="text-white mb-xs-5">Acesse o formulário para solicitar o cartão.</h2>

                <form name="abrirFormulario">
                    <div className="row">
                        <div className="col-lg-4 mt-4">
                            <label id="codigoEol">Código EOL</label>
                            <input onChange={(e) => setInputCodigoEol(e.target.value)} value={inputCodigoEol} name="codigoEol" type="text" className="form-control"/>
                        </div>
                        <div className="col-lg-4 mt-4">
                            <label htmlFor='dtNascAluno'>Data de nascimento do estudante</label>
                            <input onChange={(e) => setInputDtNascAluno(e.target.value)} value={inputDtNascAluno} id="dtNascAluno" type="date" className="form-control"/>
                        </div>
                        <div className="col-lg-4 mt-4 mt-md-5 pl-5 pr-5 pl-md-0 pr-md-0">
                            <BtnCustomizado
                                onClick={() => handleBtnAbrirCadastro('show', true, true)}
                                disable={handleBtnAAbrirFormularioDisable()}
                                type="button"
                                classeCss="btn btn-outline-primary btn-block btn-abrir-formulario mt-2"
                                texto="Abrir formulário"
                            />
                        </div>
                    </div>

                </form>
                <div className={`collapse ${collapse}  pt-5`} id="">
                    <h2 className="text-white mb-4">Solicitação do cartão </h2>

                    <div className='container-form-dados-responsável p-4 '>
                        <p className="mb-4">
                            <strong>Confirme ou altere os dados do responsável pelo(a) estudante</strong>
                        </p>
                        <form name="atualizacaoCadastral" onSubmit={handleSubmit(onSubmit)}>
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
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.cd_ddd_celular_responsavel} type="text" className="form-control" name="cd_ddd_celular_responsavel" id="cd_ddd_celular_responsavel"/>
                                            {errors.cd_ddd_celular_responsavel &&
                                            <span className="span_erro mt-1">O campo DDD é obrigatório</span>}
                                        </div>
                                        <div className="col-9 pl-1">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} value={state.nr_celular_responsavel} type="text" className="form-control" name="nr_celular_responsavel" id="nr_celular_responsavel"/>
                                            {errors.nr_celular_responsavel &&
                                            <span className="span_erro mt-1">O campo Celular é obrigatório</span>}

                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 mt-5">
                                    <label><strong>Vínculo com o(a) estudante (mãe/pai/outro)*</strong></label>
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '1'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="mae" value="1"/>
                                            <label className="form-check-label" htmlFor="mae"><strong>Mãe</strong></label>
                                        </div>

                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '2'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="pai" value="2"/>
                                            <label className="form-check-label" htmlFor="pai"><strong>Pai</strong></label>
                                        </div>
                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '3'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="responsaveLegal" value="3"/>
                                            <label className="form-check-label" htmlFor="responsaveLegal"><strong>Responsável legal</strong></label>
                                        </div>

                                        <div className="pl-4 container-radio">
                                            <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} checked={state.tp_pessoa_responsavel == '4'} className="form-check-input" type="radio" name="tp_pessoa_responsavel" id="alunoMaiorDeIdade" value="4"/>
                                            <label className="form-check-label" htmlFor="alunoMaiorDeIdade"><strong>Aluno maior de idade</strong></label>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-12">
                                            {errors.tp_pessoa_responsavel &&
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
                                                    <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} type="text" className="form-control" name="cd_cpf_responsavel" id="cd_cpf_responsavel"/>
                                                    {errors.cd_cpf_responsavel &&
                                                    <span className="span_erro mt-1">O campo Cpf do responsável é obrigatório</span>}
                                                </div>

                                                <div className='col-12 col-md-6 mt-5 mt-md-0'>
                                                    <label htmlFor="dtNascResponsavel"><strong>Data de nascimento do responsável*</strong></label>
                                                    <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} type="text" className="form-control" name="dtNascResponsavel" id="dtNascResponsavel"/>
                                                    {errors.dtNascResponsavel &&
                                                    <span className="span_erro mt-1">O campo Data de nascimento do responsável é obrigatório</span>}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-5">
                                    <label htmlFor="nomeMaeResponsavel"><strong>Nome de mãe de responsável (sem abreviações)*</strong></label>
                                    <input ref={register({required: true})} onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)} type="text" className="form-control" name="nomeMaeResponsavel" id="nomeMaeResponsavel"/>
                                    {errors.dtNascResponsavel &&
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
                                        onClick={() => handleBtnAbrirCadastro('', false, false)}
                                        disable=""
                                        type="button"
                                        classeCss="btn btn-outline-primary"
                                        texto="Cancelar"
                                    />
                                </div>
                                <div className='p-2'>
                                    <button type="submit" className="btn btn-primary">Atualizar cadastro</button>
                                </div>
                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    )
}