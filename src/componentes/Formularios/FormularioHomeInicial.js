import React from "react";
import "./formularios.scss"

export const FormularioHomeInicial = () => {
    return (
        <div className="w-100 formulario-inicial-home pt-5 pb-5 ">
            <div className="container">
                <h2 className="text-white mb-xs-5">Acesse o formulário para solicitar o cartão.</h2>
                <form>
                    <div className="row">
                        <div className="col-lg-4 mt-4">
                            <label id="codigoEol">Código EOL</label>
                            <input name="codigoEol" type="text" className="form-control" placeholder="Digite código EOL"/>
                        </div>
                        <div className="col-lg-4 mt-4">
                            <label htmlFor='dtNascAluno'>Data de nascimento do estudante</label>
                            <input id="dtNascAluno" type="text" className="form-control" placeholder="dd/mm/aaaa"/>
                        </div>
                        <div className="col-lg-4 mt-4 mt-md-5 pl-5 pr-5 pl-md-0 pr-md-0">
                            <button data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" type="button" className="btn btn-outline-primary btn-block btn-abrir-formulario mt-2">Abrir formulário</button>
                        </div>
                    </div>

                </form>
                <div className="collapse pt-5" id="collapseExample">
                    <h2 className="text-white mb-4">Solicitação do cartão </h2>

                    <div className='container-form-dados-responsável p-4 '>
                        <p className="fonte-maior mb-4">
                            <strong>Confirme ou altere os dados do responsável pelo(a) estudante</strong></p>
                        <form>
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="nomeResponsavel"><strong>Nome completo do responsável (sem abreviações)*</strong></label>
                                    <input required type="text" className="form-control" id="nomeResponsavel"/>
                                </div>

                                <div className="col-12 col-md-8 mt-5">
                                    <label htmlFor="emailResponsavel"><strong>E-mail do responsável*</strong></label>
                                    <input required type="email" className="form-control" id="emailResponsavel"/>
                                </div>

                                <div className="col-12 col-md-4 mt-5">

                                    <div className="row">
                                        <div className="col-12">
                                            <label><strong>Telefone celular do responsável*</strong></label>
                                        </div>
                                        <div className="col-3">
                                            <input required type="text" className="form-control" id="dddResponsavel"/>
                                        </div>
                                        <div className="col-9 pl-1">
                                            <input required type="text" className="form-control" id="celularResponsavel"/>
                                        </div>
                                    </div>

                                </div>

                                <div className="col-12 mt-5">
                                    <label><strong>Vínculo com o(a) estudante (mãe/pai/outro)*</strong></label>
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="pl-4 container-radio">
                                            <input className="form-check-input" type="radio" name="radiosVinculo" id="mae" value="mae" required />
                                            <label className="form-check-label" htmlFor="mae"><strong>Mãe</strong></label>
                                        </div>

                                        <div className="pl-4 container-radio">
                                            <input className="form-check-input" type="radio" name="radiosVinculo" id="pai" value="pai"/>
                                            <label className="form-check-label" htmlFor="pai"><strong>Pai</strong></label>
                                        </div>
                                        <div className="pl-4 container-radio">
                                            <input className="form-check-input" type="radio" name="radiosVinculo" id="responsaveLegal" value="responsaveLegal"/>
                                            <label className="form-check-label" htmlFor="responsaveLegal"><strong>Responsável legal</strong></label>
                                        </div>

                                        <div className="pl-4 container-radio">
                                            <input className="form-check-input" type="radio" name="radiosVinculo" id="alunoMaiorDeIdade" value="alunoMaiorDeIdade"/>
                                            <label className="form-check-label" htmlFor="alunoMaiorDeIdade"><strong>Aluno maior de idade</strong></label>
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
                                                    <label htmlFor="cpfResponsavel"><strong>Cpf do responsável*</strong></label>
                                                    <input required type="text" className="form-control" id="cpfResponsavel"/>
                                                </div>

                                                <div className='col-12 col-md-6 mt-5 mt-md-0'>
                                                    <label htmlFor="dtNascResponsavel"><strong>Data de nascimento do responsável**</strong></label>
                                                    <input required type="text" className="form-control" id="dtNascResponsavel"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-5">
                                    <label htmlFor="nomeMaeResponsavel"><strong>Nome de mãe de responsável (sem abreviações)*</strong></label>
                                    <input required type="text" className="form-control" id="nomeMaeResponsavel"/>
                                </div>

                                <div className="col-12 mt-5">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
                                        <label className="form-check-label" htmlFor="inlineCheckbox1">Declaro que as informações acima são verdadeiras</label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <div className='p-2'>
                                    <button type="submit" className="btn btn-outline-primary">Cancelar</button>
                                </div>
                                <div className='p-2'>
                                    <button type="submit" className="btn btn-primary" required >Atualizar cadastro</button>
                                </div>
                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    )
}