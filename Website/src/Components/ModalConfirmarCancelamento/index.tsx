// * Importações
import React from 'react'
import axios from 'axios'
import {Context} from '..'

import './index.scss'

// Tipagem das propriedades do componente
interface props {
    closeFun: () => void,               //Função executada ao fechar o Modal
    warnFun: (s: string) => void,       //Função executada ao ocorrer um erro 4xx
    cancelarFun: (s: string) => void,   //Função executada ao cancelar
    mostrar: boolean,
    servico_nome?: string,
    servico_preco?: number,
    data: string,
    horario: string,
    id?: string,
}

/**
 * Modal de Confirmação do Cancelamento de Agendamentos
 */
const ModalConfirmarCancelamento = (props:props) => {

    const {JWT} = React.useContext(Context) //JWT resultado do React Context

    // Lida com o fechamento do modal
    const handleBtnCancelar = () => {
        props.closeFun()
    }

    // Lida com o cancelamento do agendamento
    const cancelarAgendamento = () => {
        axios({
            method: "delete",
            url: `http://localhost:3000/cancelarAgendamento/${props.id}`,
            headers: {"auth": JWT}
        })
        .then((res) => {
            console.log(res.data.message)
            props.closeFun()
            props.cancelarFun(res.data.message)
        })
        .catch((err) => {
            if(err.response.status === 401) {
                props.warnFun(err.response.data.message)
            } else {
                console.error(err)
            }
        })
    }
    
    return (
    <section className={"modal-confirmar-cancelamento " + (props.mostrar?"mostrar":"")}>

    <section className="container-conteudo">

        <span className="voltar" onClick={handleBtnCancelar}>x</span>
        <h1>Certeza que deseja cancelar esse agendamento?</h1>

        <div className="container-detalhes">
            <p>Serviço: <span>{props.servico_nome}</span></p>
            <p>Preço: <span>R${props.servico_preco},00</span></p>
            <p>Data/Horário: <span>&nbsp;{props.data}&nbsp;</span> as <span>&nbsp;{props.horario}&nbsp;</span></p>
        </div>

        <div className="container-botoes">
            <button className="voltar" onClick={handleBtnCancelar}>
                Voltar
            </button>
            <button onClick={cancelarAgendamento} className="cancelar">
                Cancelar
            </button>
        </div>

    </section>

    </section>
    )
}

export default ModalConfirmarCancelamento