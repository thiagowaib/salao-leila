// * Importações
import React from 'react'
import axios from 'axios'
import {Context} from '../'

import './index.scss'

// Tipagem das propriedades do componente
interface props {
    closeFun: () => void,           //Função executada ao fechar o Modal
    criarFun: (s: string) => void,  //Função executada ao criar Serviço
    mostrar: boolean
}

/**
 * Modal de Criação de Serviços
 */
const ModalCriarServico = (props:props) => {
    
    const {JWT} = React.useContext(Context)     //JWT resultado do React Context

    const [nome, setNome] = React.useState("")                  //Nome do Serviço
    const [preco, setPreco] = React.useState("")                //Preço do Serviço
    const [criarDisable, setCriarDisable] = React.useState(true)//Disable do Botão de Criar

    // Lida com o Input do Nome
    const handleInputNome = (e:any) => {
        setNome(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setCriarDisable(true)
        else
            setCriarDisable(false)
    }

    // Lida com o Input do Preço
    const handleInputPreco = (e:any) => {
        setPreco(e.target.value)
        if(nome === "" || preco === "" || parseInt(preco) < 0)
            setCriarDisable(true)
        else
            setCriarDisable(false)
    }

    // Realiza o reset dos inputs ao seu estado original
    const resetInputs = () => {
        setNome("")
        setPreco("")
        setCriarDisable(true)
    }

    // Lida com o fechamento do modal
    const handleBtnCancelar = () => {
        resetInputs()
        props.closeFun()
    }

    // Realiza a criação do serviço
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