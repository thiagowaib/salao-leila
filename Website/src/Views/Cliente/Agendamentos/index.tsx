// * Importações
import React from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { Context, ContextCliente, HeaderCliente, ModalConfirmarCancelamento } from '../../../Components'

import './index.scss'
import MenuBolinhas from '../../../Assets/Icons/menu-bolinhas.svg'

/**
 * Tela de "Meus Agendamentos"
 * do painel do cliente
 */
const Agendamentos = () => {

    // Tipagem do objeto {agendamento}
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

    const {JWT} = React.useContext(Context)                 // JWT resultado do Login
    const {clienteEmail} = React.useContext(ContextCliente) // Email do cliente, resultado do Login

    const [agendamentos, setAgendamentos] = React.useState<agendamentoProps[]>([])                  //Array de objetos {Agendamento}
    const [abrirModalCancelar, setAbrirModalCancelar] = React.useState<boolean>(false)              //Controla o display do modal de cancelamento
    const [agendamentoCancelamento, setAgendamentoCancelamento] = React.useState<agendamentoProps>()//Objeto {Agendamento} para uso no modal de cancelamento
    const [agendamentoData, setAgendamentoData] = React.useState<string>("")                        //Data do objeto de Agendamento para uso no modal de cancelamento
    const [agendamentoHorario, setAgendamentoHorario] = React.useState<string>("")                  //Horário do objeto de Agendamento para uso no modal de cancelamento

    // Lida com o botão para abrir o modal de cancelamento
    const handleBtnCancelar = (agendamento:agendamentoProps) => {
        setAgendamentoCancelamento(agendamento)
        setAgendamentoData(agendamento.data)
        setAgendamentoHorario(`${agendamento.inicio.toString().padStart(2, '0')}:00`)
        setAbrirModalCancelar(true)
    }

    // Lida com o Exibir/Esconder dos botões "Cancelar"
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

    // Realiza a busca dos agendamentos do cliente
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

    // Ao carregar a view, executa a busca de agendamentos
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

            {/* Lista de Agendamentos */}
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

        {/* Instanciação do modal de cancelamento */}
        <ModalConfirmarCancelamento
            mostrar={abrirModalCancelar}
            id={agendamentoCancelamento?._id}
            servico_nome={agendamentoCancelamento?.servico_nome}
            servico_preco={agendamentoCancelamento?.valor}
            data={agendamentoData}
            horario={agendamentoHorario}
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