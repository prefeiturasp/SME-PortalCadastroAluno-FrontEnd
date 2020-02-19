import React, {useState, useContext, useEffect, useCallback} from "react";
import {AlteracaoCadastral} from "./AlteracaoCadastral";

import "./formularios.scss"
import {BtnCustomizado} from "../BtnCustomizado";
import {buscaDadosAlunoResponsavel} from "../../services/ConectarApi"
import {NotificacaoContext} from "../../context/NotificacaoContext";

export const Login = () => {

    const mensagem = useContext(NotificacaoContext);

    const [inputCodigoEol, setInputCodigoEol] = useState('');
    const [inputDtNascAluno, setInputDtNascAluno] = useState('');
    const [collapse, setCollapse] = useState('');
    const [btnDisable, setBtnDisable] = useState(false);
    const [retornoApi, setRetornoApi] = useState('');

    const [codEolBloqueio, setCodEolBloqueio] = useState([])
    const [listaCodEolBloqueado, setListaCodEolBloqueado] = useState([]);

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
    }, [codEolBloqueio])

    useEffect(() => {
        localStorage.setItem("listaCodEolBloqueado", JSON.stringify(listaCodEolBloqueado));
    }, [listaCodEolBloqueado]);

    const handleBtnAAbrirFormularioDisable = () => {

        if (btnDisable === true || inputCodigoEol === '' || inputDtNascAluno === '') {
            return true;
        } else {
            return false;
        }
    }

    const handleBtnCancelarAtualizacao = useCallback(() => {
        setCollapse('');
        setBtnDisable(false);
        limpaFormularios();
    }, [collapse, btnDisable])


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
    }, [listaCodEolBloqueado])


    const verificaCodEolBloqueado = (codEol) => {
        let listaCodEolBloqueadoStorage = localStorage.getItem("listaCodEolBloqueado");
        // Converte este json para objeto
        const arrayBloqueados = JSON.parse(listaCodEolBloqueadoStorage);

        return arrayBloqueados.includes(codEol);
    }

    const onSubmitAbrirFormulario = (e) => {
        e.preventDefault();

        if (verificaCodEolBloqueado(inputCodigoEol)) {

            mensagem.setAbrirModal(true)
            mensagem.setTituloModal("Acesso Bloqueado")
            mensagem.setMsg("Codigo EOL Bloqueado. Dirija-se a uma escola")
            setCollapse('');
            setBtnDisable(false);
            limpaFormularios();

        } else {

            buscaDadosAlunoResponsavel(inputCodigoEol, inputDtNascAluno)
                .then(retorno_api => {
                    if (retorno_api.detail === "Data de nascimento invalida para o código eol informado") {
                        mensagem.setAbrirModal(true)
                        mensagem.setTituloModal("Dados inválidos, tente novamente")
                        mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento")
                        setCollapse('');
                        setBtnDisable(false);
                        setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                        limpaFormularios();
                    } else if (retorno_api.detail === "Este estudante não faz parte do público do programa de uniforme escolar") {
                        mensagem.setAbrirModal(true)
                        mensagem.setTituloModal("Dados inválidos, tente novamente")
                        mensagem.setMsg(retorno_api.detail)
                        setCollapse('');
                        setBtnDisable(false);
                        setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                        limpaFormularios();
                    } else {
                        console.log(retorno_api)
                        setCollapse('show');
                        setBtnDisable(true);
                        setRetornoApi(retorno_api);
                        setCodEolBloqueio([]);
                    }
                })
        }
    }

    const limpaFormularios = (campos) => {

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
        });

    }

    return (

        <div className="w-100 formulario-inicial-home pt-5 pb-5 ">
            <div className="container">
                <h2 className="text-white mb-xs-5">Acesse o formulário para solicitar o uniforme escolar. </h2>

                <form onSubmit={(e) => onSubmitAbrirFormulario(e)} name="abrirFormulario" id='abrirFormulario'>
                    <div className="row">
                        <div className="col-lg-4 mt-4">
                            <label id="codigoEol">Código EOL</label>
                            <input onChange={(e) => setInputCodigoEol(e.target.value)} value={inputCodigoEol} name="codigoEol" type="text" className="form-control" placeholder="Digite código EOL"/>
                        </div>
                        <div className="col-lg-4 mt-4">
                            <label htmlFor='dtNascAluno'>Data de nascimento do estudante</label>
                            <input onChange={(e) => setInputDtNascAluno(e.target.value)} value={inputDtNascAluno} name="dtNascAluno" id="dtNascAluno" type="date" className="form-control"/>
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
                        handleBtnCancelarAtualizacao={handleBtnCancelarAtualizacao}
                        limpaFormularios={limpaFormularios}
                    />
                }
            </div>
        </div>
    )
}