import React from 'react'
import {Context} from '..'
import axios from 'axios'
import './index.scss'

interface props {
    closeFun: () => void,
    warnFun: (s: string) => void,
    cancelarFun: (s: string) => void,
    mostrar: boolean,
    servico_nome?: string,
    servico_preco?: number,
    data: string,
    horario: string,
    id?: string,
}

const ModalConfirmarCancelamento = (props:props) => {

    const {JWT} = React.useContext(Context)
    const handleBtnCancelar = () => {
        props.closeFun()
    }

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