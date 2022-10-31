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

const ModalModificarServico = (props:props) => {

    const [nome, setNome] = React.useState(props.nome)
    const [preco, setPreco] = React.useState(props.preco)
    const [modificarDisable, setModificarDisable] = React.useState(true)

    const {JWT} = React.useContext(Context)

    const handleInputNome = (e:any) => {
        setNome(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setModificarDisable(true)
        else
            setModificarDisable(false)
    }

    const handleInputPreco = (e:any) => {
        setPreco(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setModificarDisable(true)
        else
            setModificarDisable(false)
    }

    const resetInputs = () => {
        setNome("")
        setPreco("")
        setModificarDisable(true)
    }

    const handleBtnCancelar = () => {
        resetInputs()
        props.closeFun()
    }

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