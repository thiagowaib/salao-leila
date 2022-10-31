import React from 'react'
import {Context, ContextCliente} from '..'
import axios from 'axios'
import './index.scss'

interface props {
    closeFun: () => void,
    agendarFun: (s: string) => void,
    mostrar: boolean,
    servico_nome: string,
    servico_preco: number,
    data: string,
    horario: string
}

const ModalConfirmarAgendamento = (props:props) => {

    const {JWT} = React.useContext(Context)
    const {clienteEmail} = React.useContext(ContextCliente)
    const handleBtnCancelar = () => {
        props.closeFun()
    }

    const agendarHorario = () => {
        axios({
            method: "post",
            url: "http://localhost:3000/agendar",
            headers: {"auth": JWT, "Content-Type": "application/json"},
            data: {
                data: props.data,
                inicio: parseInt(props.horario.split(":")[0]),
                servico_nome: props.servico_nome,
                cliente_email: clienteEmail
            }
        })
        .then((res) => {
            console.log(res.data.message)
            props.closeFun()
            props.agendarFun(res.data.message)
        })
        .catch((err) => {
            console.error(err)
        })
    }
    
    return (
    <section className={"modal-confirmar-agendamento " + (props.mostrar?"mostrar":"")}>

    <section className="container-conteudo">

        <span className="cancelar" onClick={handleBtnCancelar}>x</span>
        <h1>Confirmar Agendamento</h1>

        <div className="container-detalhes">
            <p>Serviço: <span>{props.servico_nome}</span></p>
            <p>Preço: <span>R${props.servico_preco},00</span></p>
            <p>Data/Horário: <span>{props.data}</span> as <span>{props.horario}</span></p>
        </div>

        <div className="container-botoes">
            <button className="cancelar" onClick={handleBtnCancelar}>
                Cancelar
            </button>
            <button onClick={agendarHorario} className="agendar">
                Agendar
            </button>
        </div>

    </section>

    </section>
    )
}

export default ModalConfirmarAgendamento