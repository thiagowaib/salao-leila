import axios from 'axios'
import React from 'react'
import {Context} from '..'

import './index.scss'

interface props {
    closeFun: () => void,
    modificarFun: (s: string) => void,
    mostrar: boolean,
    nome: string,
    preco: string
}

const ModalExcluirServico = (props:props) => {

    const {JWT} = React.useContext(Context)
    const handleBtnCancelar = () => {
        props.closeFun()
    }

    const excluirServico = () => {
        axios({
            method: "delete",
            url: "http://localhost:3000/removerServico",
            headers: {"auth": JWT, "Content-Type": "application/json"},
            data: {
                nome: props.nome,
            }
        })
        .then((res) => {
            console.log(res.data.message)
            props.closeFun()
            props.modificarFun(res.data.message)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    return (
    <section className={"modal-excluir-servico " + (props.mostrar?"mostrar":"")}>

        <section className="container-conteudo">

            <span className="cancelar" onClick={handleBtnCancelar}>x</span>
            <h1>Modificar dados do Serviço</h1>

            <div className="container-detalhes">
                <p>Nome atual: <span>{props.nome}</span></p>
                <p>Preço atual: <span>{props.preco}</span></p>
            </div>

            <div className="container-botoes">
                <button className="cancelar" onClick={handleBtnCancelar}>
                    Cancelar
                </button>
                <button onClick={excluirServico} className="excluir">
                    Excluir
                </button>
            </div>

        </section>

    </section>
    )
}

export default ModalExcluirServico