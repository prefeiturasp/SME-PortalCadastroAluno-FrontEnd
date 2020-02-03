import React, {Fragment} from "react";
import "./home.scss"
import {FormularioHomeInicial} from '../../componentes/Formularios/FormularioHomeInicial'
import ImgDadosFornecer from "../../assets/img/dados-fornecer.png"
const URL_VIDEO = process.env.REACT_APP_URL_VIDEO;


export const Home = () => {
    return (
        <Fragment>
            <div className="w-100 banner-home position-relative">
                <div className="container">
                    <div className="conteudo">
                        <div className="col-lg-8 col-sm-12 col-xl-6">
                            <h1>
                                Solicite o cartão para compra
                                do uniforme.
                            </h1>
                            <p>
                                Para efetivar o novo modelo descentralizado de compra dos uniformes escolares diretamente pelas famílias, precisamos confirmar e completar alguns dados dos responsáveis pelos estudantes matriculados na Rede Municipal de Ensino. Para isso, insira abaixo o código da criança no sistema Escola Online (EOL) e a data de nascimento dela.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <FormularioHomeInicial/>

            <div className="w-100 quem-recebe-uniforme">
                <div className="container">
                    <div className="row mt-5">

                        <div className="col-lg-6 col-sm-12">
                            <div className="embed-responsive embed-responsive-16by9">
                                <iframe title="Vídeo sobre o Vaga Na Creche" src={URL_VIDEO} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        </div>

                        <div className="col-lg-6 col-sm-12 mb-lg-0 align-self-center">
                            <h1>Quem recebe o uniforme escolar?</h1>
                            <p>Quase todos os estudantes da Rede Municipal de Ensino (REM) recebem o uniforme escolar. Ou seja, devem fazer a solicitação os responsáveis por todas as crianças matriculadas nas escolas municipais, com exceção dos alunos dos Centros de Educação Infantil ("creches"), Ensino Médio e Educação de Jovens
                                e Adultos.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-100 dados-fornecer mb-5">
                <div className="container">
                    <div className="row mt-5">

                        <div className="col-lg-6 col-sm-12 mb-lg-0 align-self-center">
                            <h1>Quem recebe o uniforme escolar?</h1>
                            <p>Quase todos os estudantes da Rede Municipal de Ensino (REM) recebem o uniforme escolar. Ou seja, devem fazer a solicitação os responsáveis por todas as crianças matriculadas nas escolas municipais, com exceção dos alunos dos Centros de Educação Infantil ("creches"), Ensino Médio e Educação de Jovens
                                e Adultos.</p>
                        </div>

                        <div className="col-lg-6 col-sm-12">
                            <img
                                src={ImgDadosFornecer}
                                alt="Ilustração de um home segurando uma placa com alguns itens marcados"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    )

}