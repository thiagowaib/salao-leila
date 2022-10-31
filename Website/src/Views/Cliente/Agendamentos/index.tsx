import React from 'react'
import { Context, ContextCliente, HeaderCliente, ModalConfirmarCancelamento } from '../../../Components'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

import './index.scss'
import MenuBolinhas from '../../../Assets/Icons/menu-bolinhas.svg'

const Agendamentos = () => {

    interface agendamentoProps {
        _id: string,
        data: string,
        inicio: number,
        valor: number,
        servico_nome: string,
        servico_id: string,
        cliente_nome: string,
        cliente_id: string,
        createdAt: string,
        updatedAt: string,
        __v: number
    }

    const {clienteEmail} = React.useContext(ContextCliente)
    const {JWT} = React.useContext(Context)

    const [agendamentos, setAgendamentos] = React.useState<agendamentoProps[]>([])
    const [agendamentoCancelamento, setAgendamentoCancelamento] = React.useState<agendamentoProps>()
    const [abrirModalCancelar, setAbrirModalCancelar] = React.useState<boolean>(false)

    const handleBtnCancelar = (agendamento:agendamentoProps) => {
        setAgendamentoCancelamento(agendamento)
        setAbrirModalCancelar(true)
    }

    const handleBtnOpcoes = (key: number) => {
        const opcoes_all = document.getElementsByClassName("opcoes")
        const opcao = document.getElementById(`opcoes-${key}`)
        if(opcao?.classList.contains("mostrar")) {
          opcao.classList.remove("mostrar")
          return;
        }
        for(let i = 0; i<opcoes_all.length; i++)
          opcoes_all[i].classList.remove("mostrar")
        opcao?.classList.add("mostrar")
      }

    const getAgendamentos = () => {
        axios({
            method: "post",
            url: "http://localhost:3000/buscarAgendamentos",
            headers: {"auth": JWT, "Content-Type": "application/json"},
            data: {email: clienteEmail}
        })
        .then((res) => {
        console.log(res.data.message)
        const agendamentos = res.data.agendamentos.filter((agendamento:agendamentoProps) => {
            const dataFormatada = new Date([
                agendamento.data.split('/')[2],
                agendamento.data.split('/')[1],
                agendamento.data.split('/')[0]
            ].join('-'))

            return dataFormatada.getTime() > new Date().getTime()
        })
        setAgendamentos(agendamentos)
        })
        .catch((err) => {
        console.error(err)
        })
    }

    React.useEffect(getAgendamentos, [])

    return (
    <section className="cliente-agendamentos">
        <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
        <HeaderCliente atual="Agendamentos"/>
        <div className="container-conteudo">
            <h1 className="titulo">Meus Agendamentos</h1>
            <ul className="container-agendamentos">
                {agendamentos && agendamentos.map((agendamento, index) => {
                    return (<>
                        <li key={index}>
                            <div className='container-superior'>
                                <p>{agendamento.data} as {agendamento.inicio.toString().padStart(2, '0')}:00</p>
                                <p>R${agendamento.valor},00</p>
                            </div>
                            <div className='container-mediano'>
                                <p>{agendamento.servico_nome}</p>
                                <div className="container-opcoes">
                                    <img src={MenuBolinhas} alt="Opções" onClick={() => handleBtnOpcoes(index)}/>
                                    <div id={`opcoes-${index}`} className="opcoes">
                                        <button className="cancelar" onClick={() => handleBtnCancelar(agendamento)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </>)
                })}
            </ul>
            <footer>Telefone de Contato: <span>(14) 98214-1243</span></footer>
        </div>
        <ModalConfirmarCancelamento
            mostrar={abrirModalCancelar}
            id={agendamentoCancelamento?._id}
            servico_nome={agendamentoCancelamento?.servico_nome}
            servico_preco={agendamentoCancelamento?.valor}
            data={agendamentoCancelamento?.data}
            horario={`${agendamentoCancelamento?.inicio.toString().padStart(2,'0')}:00`}
            cancelarFun={(s) => {
                toast.success(s, {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                getAgendamentos()
            }}
            closeFun={()=>setAbrirModalCancelar(false)}
            warnFun={(s)=>{
                toast.warn(s, {
                    position: "top-left",
                    autoClose: 12000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }}
        />
    </section>
    )
}

export default Agendamentos