/* eslint eqeqeq: 0 */
/* eslint-disable */
import React, {useState, useContext, useEffect, useCallback, useRef} from "react";
import {AlteracaoCadastral} from "./AlteracaoCadastral";
import {useForm} from "react-hook-form";

import "./formularios.scss";
import {BtnCustomizado} from "../BtnCustomizado";
import {buscaDadosAlunoResponsavel} from "../../services/ConectarApi";
import {NotificacaoContext} from "../../context/NotificacaoContext";
import Loading from "../../utils/Loading";


export const Login = () => {
    const codigoEolRef = useRef();
    const mensagem = useContext(NotificacaoContext);

    const {register, handleSubmit, errors} = useForm({
        mode: "onBlur"
    });

    const [inputCodigoEol, setInputCodigoEol] = useState("");
    const [inputDtNascAluno, setInputDtNascAluno] = useState("");
    const [collapse, setCollapse] = useState("");
    const [btnDisable, setBtnDisable] = useState(false);
    const [retornoApi, setRetornoApi] = useState("");

    const [codEolBloqueio, setCodEolBloqueio] = useState([]);
    const [listaCodEolBloqueado, setListaCodEolBloqueado] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const codEolBloqueioStorage = localStorage.getItem("codEolBloqueio");
        const listaCodEolBloqueadoStorage = localStorage.getItem("listaCodEolBloqueado");

        if (codEolBloqueioStorage) {
            setCodEolBloqueio(JSON.parse(codEolBloqueioStorage));
        }
        if (listaCodEolBloqueadoStorage) {
            setListaCodEolBloqueado(JSON.parse(listaCodEolBloqueadoStorage));
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
        return (btnDisable === true || inputCodigoEol === "" || inputDtNascAluno === "");
    };

    const handleBtnCancelarAtualizacao = useCallback(() => {
        codigoEolRef.current.focus();
        setCollapse("");
        setBtnDisable(false);
        limpaFormulario();
    }, []);

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

    const verificaStatusCpf = (dataVerificaCPF) => {
        if (dataVerificaCPF.detail.responsaveis[0].status && dataVerificaCPF.detail.responsaveis[0].status === "DESATUALIZADO") {
            dataVerificaCPF.detail.responsaveis[0].cd_cpf_responsavel = null
        }
        return dataVerificaCPF;
    }

    const buscaDadosAluno = (inputCodigoEol, inputDtNascAluno) => {

        buscaDadosAlunoResponsavel(inputCodigoEol, inputDtNascAluno).then(retorno_api => {

            if (retorno_api.detail === "Data de nascimento invalida para o código eol informado" || retorno_api.detail === "API EOL com erro. Status: 404" || retorno_api.detail === "API EOL com erro. Status: 500" || retorno_api.detail === "Código EOL não existe") {
                mensagem.setAbrirModal(true);
                mensagem.setTituloModal("Dados inválidos, tente novamente");
                mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento");
                setCollapse("");
                setBtnDisable(false);
                setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                limpaFormulario();
                setLoading(false);
            } else if (retorno_api.detail === "Este estudante não faz parte do público do programa de uniforme escolar") {
                mensagem.setAbrirModal(true);
                mensagem.setTituloModal("Dados inválidos, tente novamente");
                mensagem.setMsg(retorno_api.detail);
                setCollapse("");
                setBtnDisable(false);
                setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                limpaFormulario();
                setLoading(false);
            } else {
                setCollapse("show");
                setBtnDisable(true);
                setRetornoApi(verificaStatusCpf(retorno_api));
                setCodEolBloqueio([]);
                setLoading(false);
            }
        }).catch(() => {
            mensagem.setAbrirModal(true);
            mensagem.setTituloModal("Dados inválidos, tente novamente");
            mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento");
            setLoading(false);
        });
    };

    const verificaCodEolBloqueado = codEol => {
        let listaCodEolBloqueadoStorage = localStorage.getItem("listaCodEolBloqueado");
        // Converte este json para objeto
        if (listaCodEolBloqueadoStorage) {
            const arrayBloqueados = JSON.parse(listaCodEolBloqueadoStorage);
            return arrayBloqueados.includes(codEol);
        }
    };

    const onSubmitAbrirFormulario = (data, e) => {
        codigoEolRef.current.focus();
        setLoading(true);
        e.preventDefault();
        if (verificaCodEolBloqueado(inputCodigoEol)) {
            mensagem.setAbrirModal(true);
            mensagem.setTituloModal("Acesso Bloqueado");
            mensagem.setMsg("Codigo EOL Bloqueado. Dirija-se à escola do aluno");
            setCollapse("");
            setBtnDisable(false);
            limpaFormulario();
            setLoading(false);
        } else {
            buscaDadosAluno(inputCodigoEol, inputDtNascAluno);
        }
    };

    const limpaFormulario = () => {
        setInputCodigoEol("");
        setInputDtNascAluno("");
    };

    return (
        <div className="w-100 formulario-inicial-home pt-5 pb-5 ">
            <div className="container">
                <h2 className="text-white mb-xs-5">
                    Acesse o formulário para solicitar o uniforme escolar.{" "}
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmitAbrirFormulario)}
                    name="abrirFormulario"
                    id="abrirFormulario"
                >
                    <div className="row">
                        <div className="col-lg-4 mt-4">
                            <label id="codigoEol">Código EOL*</label>
                            <input
                                ref={e => {
                                    register(e, {required: true, maxLength: 10});
                                    codigoEolRef.current = e;
                                }}
                                readOnly={collapse === "show"}
                                onChange={e => setInputCodigoEol(e.target.value.trim())}
                                value={inputCodigoEol}
                                name="codigoEol"
                                type="number"
                                className="form-control"
                                placeholder="Digite código EOL"
                            />
                            {errors.codigoEol && errors.codigoEol.type === "required" &&
                            <span className="span_erro text-white mt-1">Código EOL é obrigatório </span>}
                            {errors.codigoEol && errors.codigoEol.type === "maxLength" &&
                            <span className="span_erro text-white mt-1">Permitido até 10 dígitos</span>}
                        </div>
                        <div className="col-lg-4 mt-4">
                            <label htmlFor="dtNascAluno">
                                Data de nascimento do estudante*
                            </label>
                            <input
                                ref={register({
                                    required: true, maxLength: 10
                                })}
                                readOnly={collapse === "show"}
                                onChange={e => setInputDtNascAluno(e.target.value.trim())}
                                value={inputDtNascAluno}
                                name="dtNascAluno"
                                id="dtNascAluno"
                                type="date"
                                className="form-control"
                                max="9999-12-31"
                            />
                            {errors.dtNascAluno && errors.dtNascAluno.type === "required" && <span
                                className="span_erro text-white mt-1">Data de nascimento do estudante é obrigatório</span>}
                            {errors.dtNascAluno && errors.dtNascAluno.type === "maxLength" &&
                            <span className="span_erro text-white mt-1">Digite uma data Válida</span>}
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
                    loading ? (
                        <Loading
                            corGrafico="white"
                            corFonte="white"
                            marginTop="5"
                            marginBottom="4"
                        />
                    ) : null
                }
                {
                    retornoApi && (

                        <AlteracaoCadastral
                            collapse={collapse}
                            setCollapse={setCollapse}
                            retorno_api={retornoApi}
                            inputCodigoEol={inputCodigoEol}
                            inputDtNascAluno={inputDtNascAluno}
                            setBtnDisable={setBtnDisable}
                            setInputCodigoEol={setInputCodigoEol}
                            setInputDtNascAluno={setInputDtNascAluno}
                            codigoEolRef={codigoEolRef}
                            //setLoading={setLoading}
                            handleBtnCancelarAtualizacao={handleBtnCancelarAtualizacao}
                        />
                    )
                }
            </div>
        </div>);
};
