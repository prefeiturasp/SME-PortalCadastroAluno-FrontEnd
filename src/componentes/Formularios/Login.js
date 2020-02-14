import React, {useState, useContext} from "react";
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

    const handleBtnCancelarAtualizacao = () => {
        setCollapse('');
        setBtnDisable(false);
        limpaFormularios();

    }

    const onSubmitAbrirFormulario = (e) => {
        e.preventDefault();

        buscaDadosAlunoResponsavel(inputCodigoEol, inputDtNascAluno)
            .then(retorno_api => {
                setCollapse('show');
                setBtnDisable(true);
                setRetornoApi(retorno_api);
            })
            .catch(error => {
                //setMsg("Dados inválidos, tente novamente");
                mensagem.setAbrirModal(true)
                mensagem.setTituloModal("Dados inválidos, tente novamente")
                mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento")
                setCollapse('');
                setBtnDisable(false);
                console.log(error.message);
                limpaFormularios()
            });
    }

    const limpaFormularios = (campos) => {

        //console.log("Ollyver limpaFormularios campos ", campos)

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
                        collapse = {collapse}
                        setCollapse = {setCollapse}
                        retorno_api = {retornoApi}
                        inputCodigoEol = {inputCodigoEol}
                        inputDtNascAluno = {inputDtNascAluno}
                        setBtnDisable = {setBtnDisable}
                        handleBtnCancelarAtualizacao = {handleBtnCancelarAtualizacao}
                        limpaFormularios = {limpaFormularios}
                    />
                }
            </div>
        </div>
    )
}