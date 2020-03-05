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
import InputMask from "react-input-mask";

import DatePicker, {registerLocale} from "react-datepicker";
import * as moment from 'moment'
import pt from "date-fns/locale/pt-BR"
registerLocale("pt", pt );
import 'react-datepicker/dist/react-datepicker.css';

import {validarDtNascEstudante, validarPalavrao} from "../../utils/ValidacoesAdicionaisFormularios";

import * as yup from "yup";

export const Login = () => {

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
    });


    const codigoEolRef = useRef();
    let  datepickerRef  = useRef(null);
    const mensagem = useContext(NotificacaoContext);
    const {register, handleSubmit, errors} = useForm({
        //mode: "onBlur"
        validationSchema: SignupSchema,
    });

    const [inputCodigoEol, setInputCodigoEol] = useState("");
    const [inputDtNascAluno, setInputDtNascAluno] = useState(null);
    const [collapse, setCollapse] = useState("");
    const [btnDisable, setBtnDisable] = useState(false);
    const [retornoApi, setRetornoApi] = useState("");
    const [codEolBloqueio, setCodEolBloqueio] = useState([]);
    const [listaCodEolBloqueado, setListaCodEolBloqueado] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sparErro, setSpanErro] = useState(false);
    const [formEvent, setFormEvent] = useState(false);

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
        return (btnDisable === true ||  inputDtNascAluno === "" || inputDtNascAluno === null);
    };

    const handleBtnCancelarAtualizacao = useCallback((formEvent) => {
        codigoEolRef.current.focus();
        setCollapse("");
        setBtnDisable(false);
        limpaFormulario(formEvent);
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

    const buscaDadosAluno = (inputCodigoEol, inputDtNascAluno, formEvent) => {
        buscaDadosAlunoResponsavel(inputCodigoEol, inputDtNascAluno)
        .then(retorno_api => {
            if (retorno_api.detail === "Data de nascimento invalida para o código eol informado" || retorno_api.detail === "API EOL com erro. Status: 404" || retorno_api.detail === "API EOL com erro. Status: 500" || retorno_api.detail === "Código EOL não existe") {
                mensagem.setAbrirModal(true);
                mensagem.setTituloModal("Dados inválidos, tente novamente");
                mensagem.setMsg("Tente novamente inserir o código EOL e a data de nascimento");
                setCollapse("");
                setBtnDisable(false);
                setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                limpaFormulario(formEvent);
                setLoading(false);
            } else if (retorno_api.detail === "Este estudante não faz parte do público do programa de uniforme escolar") {
                mensagem.setAbrirModal(true);
                mensagem.setTituloModal("Dados inválidos, tente novamente");
                mensagem.setMsg(retorno_api.detail);
                setCollapse("");
                setBtnDisable(false);
                setCodEolBloqueio([...codEolBloqueio, inputCodigoEol]);
                limpaFormulario(formEvent);
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
    const onSubmitAbrirFormulario = (data, formEventRecebido) => {

        setInputCodigoEol(data.codigoEol)
        setFormEvent(formEventRecebido)

        codigoEolRef.current.focus();
        setLoading(true);
        formEventRecebido.preventDefault();
        if (verificaCodEolBloqueado(data.codigoEol)) {
            mensagem.setAbrirModal(true);
            mensagem.setTituloModal("Acesso Bloqueado");
            mensagem.setMsg("Codigo EOL Bloqueado. Dirija-se à escola do aluno");
            setCollapse("");
            setBtnDisable(false);
            limpaFormulario(formEventRecebido);
            setLoading(false);
        } else {
            buscaDadosAluno(data.codigoEol, validarDtNascEstudante(inputDtNascAluno), formEventRecebido);
        }
    };

    const limpaFormulario = (formEvent) => {
        formEvent.target.reset();
        setInputCodigoEol("");
        setInputDtNascAluno("");
    };
    const handleChangeRaw = (value ) => {
        const date = new Date(value.currentTarget.value);
        if (!moment(date).isValid()) {
            setSpanErro(true);
            //datepickerRef.input.focus()
        } else {
            setSpanErro(false);
        }
    };
    const handleSelect  = (value)=>{
        const date = new Date(value);
        if (!moment(date).isValid() || value=== null) {
            setSpanErro(true);
        } else {
            setSpanErro(false);
        }
    }
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
                            <InputMask
                                mask="9999999999"
                                maskPlaceholder={null}
                                ref={e => {
                                    register(e);
                                    codigoEolRef.current = e;
                                }}
                                readOnly={collapse === "show"}
                                name="codigoEol"
                                type="text"
                                className="form-control"
                                placeholder="Somente números"
                            />
                            {errors.codigoEol && <span className="span_erro text-white mt-1">{errors.codigoEol.message}</span>}
                        </div>
                        <div className="col-lg-4 mt-4">
                            <label htmlFor="dtNascAluno">
                                Data de nascimento do estudante*
                            </label>
                            <DatePicker
                                ref={(r) => datepickerRef = r}
                                className="form-control"
                                placeholderText="Somente números"
                                selected={inputDtNascAluno}
                                onChange={date => setInputDtNascAluno(date)}
                                onChangeRaw={(e)=>handleChangeRaw(e)}
                                onSelect={(e)=>handleSelect(e)}
                                dateFormat="dd/MM/yyyy"
                                locale="pt"
                                showYearDropdown
                                readOnly={collapse === "show"}
                                customInput={
                                    <InputMask
                                        mask="99/99/9999"
                                        name="dtNascAluno"
                                    />
                                }
                            />
                            {sparErro ? "Digite uma data Válida" : null}
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
                            inputDtNascAluno={validarDtNascEstudante(inputDtNascAluno)}
                            setBtnDisable={setBtnDisable}
                            setInputDtNascAluno={setInputDtNascAluno}
                            codigoEolRef={codigoEolRef}
                            handleBtnCancelarAtualizacao={handleBtnCancelarAtualizacao}
                            formEvent={formEvent}
                        />
                    )
                }
            </div>
        </div>);
};
