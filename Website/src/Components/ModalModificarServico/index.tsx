// * Importações
import React from 'react'
import axios from 'axios'
import {Context} from '..'

import './index.scss'

// Tipagem das propriedades do componente
interface props {
    closeFun: () => void,               //Função executada ao fechar o Modal
    modificarFun: (s: string) => void,  //Função executada ao criar Serviço
    mostrar: boolean,
    nome: string,
    preco: string
}

/**
 * Modal de Modificação de Serviços
 */
const ModalModificarServico = (props:props) => {

    const {JWT} = React.useContext(Context) //JWT resultado do React Context

    const [nome, setNome] = React.useState(props.nome)                  //Nome do Serviço
    const [preco, setPreco] = React.useState(props.preco)               //Preço do Serviço
    const [modificarDisable, setModificarDisable] = React.useState(true)//Disable do Botão de Modificar

    // Lida com o Input do Nome
    const handleInputNome = (e:any) => {
        setNome(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setModificarDisable(true)
        else
            setModificarDisable(false)
    }

    // Lida com o Input do Preço
    const handleInputPreco = (e:any) => {
        setPreco(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setModificarDisable(true)
        else
            setModificarDisable(false)
    }

    // Realiza o reset dos inputs ao seu estado original
    const resetInputs = () => {
        setNome("")
        setPreco("")
        setModificarDisable(true)
    }

    // Lida com o fechamento do modal
    const handleBtnCancelar = () => {
        resetInputs()
        props.closeFun()
    }
    
    // Realiza a modificação do serviço
    const modificarServico = () => {
        axios({
            method: "put",
            url: "http://localhost:3000/modificarServico",
            headers: {"auth": JWT, "Content-Type": "application/json"},
            data: {
                nome: props.nome,
                novoNome: nome,
                novoPreco: preco
            }
        })
        .then((res) => {
            console.log(res.data.message)
            resetInputs()
            props.closeFun()
            props.modificarFun(res.data.message)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    return (
    <section className={"modal-modificar-servico " + (props.mostrar?"mostrar":"")}>

        <section className="container-conteudo">

            <span className="cancelar" onClick={handleBtnCancelar}>x</span>
            <h1>Modificar dados do Serviço</h1>

            <div className="container-detalhes">
                <p>Nome atual: <span>{props.nome}</span></p>
                <p>Preço atual: <span>{props.preco}</span></p>
            </div>

            <div className="container-inputs">
                <div className="input">
                    <label htmlFor="input-criar-nome">Novo Nome</label>
                    <input onInput={handleInputNome} placeholder={props.nome} value={nome} type="text" id="input-criar-nome" />
                </div>
                <div className="input">
                    <label htmlFor="input-criar-Valor">Novo Valor</label>
                    <input onInput={handleInputPreco} placeholder={props.preco} value={preco}type="number" id="input-criar-Valor" />
                </div>
            </div>

            <div className="container-botoes">
                <button className="cancelar" onClick={handleBtnCancelar}>
                    Cancelar
                </button>
                <button onClick={modificarServico} className="modificar" disabled={modificarDisable}>
                    Modificar
                </button>
            </div>

        </section>

    </section>
    )
}

export default ModalModificarServico