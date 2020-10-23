import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Botao from "../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../Botao/constants";

export class ModalAceitaDivergencia extends Component {
  render() {
    const {
      showModal,
      closeModal,
      nome_EOL,
      nome_fornecido,
      onSubmit,
    } = this.props;
    return (
      <Modal
        dialogClassName="modal-50w modal-question"
        show={showModal}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Atenção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <p className="title">
                O nome do(a) responsável é diferente do que está cadastrado no
                sistema Escola Online (EOL). Se você confirmar essa alteração,
                deverá comparecer à escola para apresentar seus documentos e
                validar o novo dado fornecido. Tem certeza de que deseja fazer a
                mudança?
              </p>
              <p>Nome no EOL: {nome_EOL}</p>
              <p>Nome fornecido: {nome_fornecido}</p>
              <p>
                Se não quiser fazer a mudança, feche este aviso e, no campo
                "Nome do resposável", escreva novamente o nome que já estava lá
                (ou seja, o "Nome no EOL")
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="row mt-5">
            <div className="col-12">
              <Botao
                texto="Fechar este aviso"
                type={BUTTON_TYPE.BUTTON}
                onClick={closeModal}
                style={BUTTON_STYLE.BLUE_OUTLINE}
                className="ml-3"
              />
              <Botao
                texto="Confirmar a alteração"
                type={BUTTON_TYPE.BUTTON}
                onClick={onSubmit}
                style={BUTTON_STYLE.BLUE}
                className="ml-3"
              />
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}
