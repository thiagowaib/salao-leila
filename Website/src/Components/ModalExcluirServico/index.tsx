// * Importações
import React from 'react'
import axios from 'axios'
import {Context} from '..'

import './index.scss'

// Tipagem das propriedades do componente
interface props {
    closeFun: () => void,                //Função executada ao fechar o Modal
    excluirFun: (s: string) => void,    //Função executada ao excluir Serviço
    mostrar: boolean,
    nome: string,
    preco: string
}

/**
 * Modal de Exclusão de Serviços
 */
const ModalExcluirServico = (props:props) => {

    const {JWT} = React.useContext(Context) //JWT resultado do React Context

    // Lida com o fechamento do modal
    const handleBtnCancelar = () => {
        props.closeFun()
    }

    // Realiza a exclusão do serviço
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
            props.excluirFun(res.data.message)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    return (
    <section className={"modal-excluir-servico " + (props.mostrar?"mostrar":"")}>

        <section className="container-conteudo">

            <span className="cancelar" onClick={handleBtnCancelar}>x</span>
            <h1>Certeza que deseja excluir esse serviço?</h1>

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