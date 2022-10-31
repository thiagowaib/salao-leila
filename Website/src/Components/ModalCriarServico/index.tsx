import axios from 'axios'
import React from 'react'
import {Context} from '../'

import './index.scss'

interface props {
    closeFun: () => void,
    criarFun: (s: string) => void,
    mostrar: boolean
}

const ModalCriarServico = (props:props) => {

    const [nome, setNome] = React.useState("")
    const [preco, setPreco] = React.useState("")
    const [criarDisable, setCriarDisable] = React.useState(true)

    const {JWT} = React.useContext(Context)

    const handleInputNome = (e:any) => {
        setNome(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setCriarDisable(true)
        else
            setCriarDisable(false)
    }

    const handleInputPreco = (e:any) => {
        setPreco(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setCriarDisable(true)
        else
            setCriarDisable(false)
    }

    const resetInputs = () => {
        setNome("")
        setPreco("")
        setCriarDisable(true)
    }

    const handleBtnCancelar = () => {
        resetInputs()
        props.closeFun()
    }

    const criarServico = () => {
        axios({
            method: "post",
            url: "http://localhost:3000/novoServico",
            headers: {"auth": JWT, "Content-Type": "application/json"},
            data: {
                nome, preco
            }
        })
        .then((res) => {
            console.log(res.data.message)
            resetInputs()
            props.closeFun()
            props.criarFun(res.data.message)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    return (
    <section className={"modal-criar-servico " + (props.mostrar?"mostrar":"")}>

        <section className="container-conteudo">

            <span className="cancelar" onClick={handleBtnCancelar}>x</span>
            <h1>Novo Serviço</h1>

            <div className="container-inputs">
                <div className="input">
                    <label htmlFor="input-criar-nome">Nome do Serviço</label>
                    <input onInput={handleInputNome} value={nome} type="text" id="input-criar-nome" />
                </div>
                <div className="input">
                    <label htmlFor="input-criar-Valor">Valor do Serviço</label>
                    <input onInput={handleInputPreco} value={preco}type="number" id="input-criar-Valor" />
                </div>
            </div>

            <div className="container-botoes">
                <button className="cancelar" onClick={handleBtnCancelar}>
                    Cancelar
                </button>
                <button onClick={criarServico} className="criar" disabled={criarDisable}>
                    Criar
                </button>
            </div>

        </section>

    </section>
    )
}

export default ModalCriarServico