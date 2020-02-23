import React, {useState, useContext, useEffect, useCallback} from "react";
import {AlteracaoCadastral} from "./AlteracaoCadastral";
import {useForm} from 'react-hook-form'

import "./formularios.scss"
import {BtnCustomizado} from "../BtnCustomizado";
import {buscaDadosAlunoResponsavel} from "../../services/ConectarApi"
import {NotificacaoContext} from "../../context/NotificacaoContext";

export const Login = () => {

    const mensagem = useContext(NotificacaoContext);

    const {register, handleSubmit, errors, setValue, setError} = useForm({
        mode: "onBlur"
    });

    const [inputCodigoEol, setInputCodigoEol] = useState('');
    const [inputDtNascAluno, setInputDtNascAluno] = useState('');
    const [collapse, setCollapse] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);
    const [retornoApi, setRetornoApi] = useState('');

    const [codEolBloqueio, setCodEolBloqueio] = useState([]);
    const [listaCodEolBloqueado, setListaCodEolBloqueado] = useState([]);

    useEffect(() => {
        const codEolBloqueioStorage = localStorage.getItem("codEolBloqueio");
        const listaCodEolBloqueadoStorage = localStorage.getItem("listaCodEolBloqueado");

        if (codEolBloqueioStorage) {
            setCodEolBloqueio(JSON.parse(codEolBloqueioStorage));
        }
        if (listaCodEolBloqueadoStorage) {
            setListaCodEolBloqueado(JSON.parse(listaCodEolBloqueadoStorage))
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("codEolBloqueio", JSON.stringify(codEolBloqueio));
        armazenaCodEolBloqueados();
    }, [codEolBloqueio]);

    useEffect(() => {
        localStorage.setItem("listaCodEolBloqueado", JSON.stringify(listaCodEolBloqueado));
    }, [listaCodEolBloqueado]);

    const handleBtnAAbrirFormularioDisable = () => {

        return btnDisable === true || inputCodigoEol === '' || inputDtNascAluno === '';
    };

    const handleBtnCancelarAtualizacao = useCallback(() => {
        setCollapse('');
        setBtnDisable(false);
        limpaFormulario();
    }, [collapse, btnDisable]);


    const armazenaCodEolBloqueados = useCallback(() => {

        let codEolBloqueioStorage = localStorage.getItem("codEolBloqueio");
        // Converte este json para objeto
        const arrayCodEolBloqueio = JSON.parse(codEolBloqueioStorage);

        if (arrayCodEolBloqueio.length >= 3) {

            //Filtrei o array removendo os duplicados. Se só sobrou um elemento, todos são iguais.
            const filtrado = arrayCodEolBloqueio.filter(function (elem, pos, arr) {
                return arr.indexOf(elem) === pos;
            });

            if (filtrado.length === 1) {
                setListaCodEolBloqueado([...listaCodEolBloqueado, filtrado[0]]);
                setCodEolBloqueio([]);
            } else {
                setCodEolBloqueio([]);
            }
        }
    }, [listaCodEolBloqueado]);


    const verificaCodEolBloqueado = (codEol) => {
        let listaCodEolBloqueadoStorage = localStorage.getItem("listaCodEolBloqueado");
        // Converte este json para objeto

        if (listaCodEolBloqueadoStorage) {
            const arrayBloqueados = JSON.parse(listaCodEolBloqueadoStorage);

            return arrayBloqueados.includes(codEol);
        }
    };

    const onSubmitAbrirFormulario = (data, e) => {
        e.preventDefault();

        if (verificaCodEolBloqueado(inputCodigoEol)) {

            mensagem.setAbrirModal(true);
            mensagem.setTituloModal("Acesso Bloqueado");
            mensagem.setMsg("Codigo EOL Bloqueado. Dirija-se à escola do aluno");
            setCollapse('');
            setBtnDisable(false);
            limpaFormulario();

        } else {

            buscaDadosAlunoResponsavel(inputCodigoEol, inputDtNascAluno)

                .then(retorno_api => {
                    if (retorno_api.detail === "Data de nascimento invalida para o código eol informado" || retorno_api.detail === "API EOL com erro. Status: 404" || retorno_api.detail === "API EOL com erro. Status: 500") {
                        mensagem.setAbrirModal(true);
                        mensagem.setTituloModal("Dados inválidos, tente novamente");
                        mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento");
                        setCollapse('');
                        setBtnDisable(false);
                        setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                        limpaFormulario();
                    } else if (retorno_api.detail === "Este estudante não faz parte do público do programa de uniforme escolar") {
                        mensagem.setAbrirModal(true);
                        mensagem.setTituloModal("Dados inválidos, tente novamente");
                        mensagem.setMsg(retorno_api.detail);
                        setCollapse('');
                        setBtnDisable(false);
                        setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                        limpaFormulario();
                    } else {
                        setCollapse('show');
                        setBtnDisable(true);
                        setRetornoApi(retorno_api);
                        setCodEolBloqueio([]);
                    }
                })
                .catch(() => {
                    mensagem.setAbrirModal(true)
                    mensagem.setTituloModal("Dados inválidos, tente novamente")
                    mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento")
                })
        }
    }

    const limpaFormulario = () => {

        setInputCodigoEol('')
        setInputDtNascAluno('')

    }

    useEffect(() => {
        register({ name: "firstName" }, { required: true });
        register({ name: "lastName" }, {required: true, maxLength: 10});
    }, [])

    return (

        <div className="w-100 formulario-inicial-home pt-5 pb-5 ">
            <div className="container">
                <h2 className="text-white mb-xs-5">Acesse o formulário para solicitar o uniforme escolar. </h2>

                <form onSubmit={handleSubmit(onSubmitAbrirFormulario)}  name="abrirFormulario" id='abrirFormulario'>
                    <div className="row">
                        <div className="col-lg-4 mt-4">

                            <label id="firstName">Teste*</label>
                            <input className="form-control"
                                name="lastName"
                                onChange={e => {
                                    const value = e.target.value;
                                    if (value === "test") {
                                        setError("lastName", "notMatch")
                                    } else {
                                        setValue("lastName", e.target.value)
                                    }
                                }}
                            />
                            {errors.lastName && <span className="span_erro text-white mt-1">ERRO AQUI</span>}






                            <label id="codigoEol">Código EOL*</label>
                            <input
                                ref={
                                    register({
                                        required: true,
                                        maxLength: 10
                                    })
                                }
                                readOnly={collapse === 'show'} onChange={(e) => setInputCodigoEol(e.target.value.trim())} value={inputCodigoEol} name="codigoEol" type="number" className="form-control" placeholder="Digite código EOL"/>
                            {errors.codigoEol && errors.codigoEol.type === "required" && <span className="span_erro text-white mt-1">Código EOL é obrigatório</span>}
                            {errors.codigoEol && errors.codigoEol.type === "maxLength" && <span className="span_erro text-white mt-1">Permitido até 10 dígitos</span>}
                        </div>
                        <div className="col-lg-4 mt-4">
                            <label htmlFor='dtNascAluno'>Data de nascimento do estudante*</label>
                            <input
                                ref={
                                    register({
                                        required: true,
                                        maxLength: 10
                                    })
                                }
                                readOnly={collapse === 'show'} onChange={(e) => setInputDtNascAluno(e.target.value.trim())} value={inputDtNascAluno} name="dtNascAluno" id="dtNascAluno" type="date" className="form-control" max="9999-12-31"/>
                            {errors.dtNascAluno && errors.dtNascAluno.type === "required" && <span className="span_erro text-white mt-1">Data de nascimento do estudante é obrigatório</span>}
                            {errors.dtNascAluno && errors.dtNascAluno.type === "maxLength" && <span className="span_erro text-white mt-1">Digite uma data Válida</span>}
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

                {
                    retornoApi &&
                    <AlteracaoCadastral
                        collapse={collapse}
                        setCollapse={setCollapse}
                        retorno_api={retornoApi}
                        inputCodigoEol={inputCodigoEol}
                        inputDtNascAluno={inputDtNascAluno}
                        setBtnDisable={setBtnDisable}
                        setInputCodigoEol={setInputCodigoEol}
                        setInputDtNascAluno={setInputDtNascAluno}
                        handleBtnCancelarAtualizacao={handleBtnCancelarAtualizacao}
                    />
                }
            </div>
        </div>
    )
}