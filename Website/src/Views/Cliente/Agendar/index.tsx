// * Importações
import React from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { HeaderCliente,Context,ContextCliente, ModalConfirmarAgendamento } from '../../../Components'

import './index.scss'
import ChevronRight from '../../../Assets/Icons/chevron-right.svg'
import ChevronLeft from '../../../Assets/Icons/chevron-left.svg'

/**
 * Tela para realizar agendamentos
 * no painel do cliente
 */
const Agendar = () => {

  // Tipagem do objeto {Agendamento}
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
  // Tipagem do objeto {Serviço}
  interface servicoProps {
    _id: string,
    nome: string,
    preco: number,
    createdAt: string,
    updatedAt: string,
    __v: number
  }

  // Tipagem do array de objetos {Serviço}[]
  interface servicosProps {
    [x: string]: any
    servicos: servicoProps[]
  }

  const {JWT} = React.useContext(Context)                 // JWT resultado do Login
  const {clienteEmail} = React.useContext(ContextCliente) // Email do cliente, resultado do Login

  const [servicos, setServicos] = React.useState<servicosProps>()               //Array de objetos {Serviço}
  const [servicoEscolhido, setServicoEscolhido] = React.useState<servicoProps>()//Objeto do {Serviço} escolhido
  const [week, setWeek] = React.useState<Date[]>()                              //Array de [Dates] da semana
  const [weekCount, setWeekCount] = React.useState(0)                           //Número da semana buscada (relativo a semana atual: 0)
  const [horariosOcupados, setHorariosOcupados] = React.useState<any>(null)     //Objeto de dias/horarios ocupados
  const [dataLembrete, setDataLembrete] = React.useState<Date>(new Date())      //Data do agendamento a ser mostrada no lembrete
  
  const [abrirModalConfirmacao, setAbrirModalConfirmacao] = React.useState(false) //Controla o display do modal de Confirmação
  const [dataModalConfirmacao, setDataModalConfirmacao] = React.useState("")      //Data utilizada no modal de Confirmação
  const [horarioModalConfirmacao, setHorarioModalConfirmacao] = React.useState("")//Horário utilizado no modal de Confirmação

  let horariosLivres:number[] = [8, 9, 10, 11, 13, 14, 15, 16, 17]              //Array contendo todos os horários possíveis

  // Lida com a escolha de serviço
  const handleEscolhaServico = (index:number, servico:servicoProps) => {
    const servicos_all = document.getElementsByClassName("servicos")
    const servico_atual  = document.getElementById(`servico-${index}`)
    if(servico_atual?.classList.contains("escolhido")) {
      servico_atual?.classList.remove("escolhido")
      setServicoEscolhido(undefined)
    } else {
      for(let i=0; i<servicos_all.length; i++)
        servicos_all[i].classList.remove("escolhido")
      servico_atual?.classList.add("escolhido")
      setServicoEscolhido(servico)
    }
  }

  // Função que retorna um array com as datas da semana em questão
  // (addWeek=0 para semana atual)
  const getWeek = (addWeek:number = 0) => {
    let today = new Date()
    if(addWeek !== 0)
      today = new Date(new Date().getTime() + (addWeek * 7 * 24 * 60 * 60 * 1000))
    const weekday = today.getDay()

    let weekArr = [
      new Date(), 
      new Date(), 
      new Date(), 
      new Date(),  
      new Date(), 
      new Date(), 
      new Date()
    ]
    weekArr[weekday] = today
    weekArr = weekArr.map((day, index) => {
      let diff = index - weekday
      return new Date(today.getTime() + (diff * 24 * 60 * 60 * 1000))
    })
    setWeek(weekArr)
  }

  // Busca os horários ocupados
  const getHorariosOcupados = () => {
    axios({
      method: "get",
      url: "http://localhost:3000/buscarDatasAgendadas",
      headers: {"auth": JWT},
    })
    .then((res) => {
      setHorariosOcupados(res.data)
    })
    .catch((err) => {
      console.error(err)
    })
  }
  
  // Busca os serviços cadastrados
  const getServicos = () => {

    axios({
      method: "get",
      url: "http://localhost:3000/buscarServicos",
      headers: {"auth": JWT}
    })
    .then((res) => {
      console.log(res.data.message)
      setServicos(res.data.servicos)
    })
    .catch((err) => {
      console.error(err)
    })
  }

  // Lista os horários disponíveis
  const listHorarios = (dataFormatada:string, ) => {
    let horarios:number[]
    if(horariosOcupados[`${dataFormatada}`] !== undefined)
    {
      horarios = horariosLivres.filter((h:number) => {
        return !horariosOcupados[`${dataFormatada}`].includes(h)
      })
    } else {
      horarios = horariosLivres
    }
    return horarios
  }

  // Busca um Array de datas onde há agendamentos já feitos pelo cliente
  const getAgendamentosExistentes = () => {
    axios({
      method: "post",
      url: "http://localhost:3000/buscarAgendamentos",
      headers: {"auth": JWT, "Content-Type": "application/json"},
      data: {email: clienteEmail}
    })
    .then((res) => {
      console.log(res.data.message)
      res.data.agendamentos.forEach((agendamento:agendamentoProps) => {

        const dataFormatada = new Date([
          agendamento.data.split("/")[2].padStart(2, '0'),
          (parseInt(agendamento.data.split("/")[1])).toString().padStart(2, '0'),
          agendamento.data.split("/")[0].padStart(2, '0')
        ].join('/'))

        setDataLembrete(dataFormatada)
        if(dataFormatada.getTime() >= new Date().getTime() && dataFormatada.getTime() <= new Date().getTime())
          setDataLembrete(dataFormatada)
      })
    })
    .catch((err) => {
      console.error(err)
    })
  }

  // Lida com o click no horário durante o processo de agendamento
  const handleClickHorario = (dataFormatada:string, hora:number) => {
    setAbrirModalConfirmacao(true)
    setDataModalConfirmacao(dataFormatada)
    setHorarioModalConfirmacao(`${hora.toString().padStart(2,'0')}:00`)
  }

  /**
   * Ao carregar a View, executa
   * a busca dos serviços cadastrados;
   * a semana atual;
   * os horários ocupados,
   * os agendamentos já realizados pelo cliente.
   */
  React.useEffect(() => {
    getServicos()
    getWeek()
    getHorariosOcupados()
    getAgendamentosExistentes()
  }, [])
  
  return (<>
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
    <section className="cliente-agendar">
      <HeaderCliente atual="Agendar"/>
      <div className="container-conteudo">

        {/* Seleção de Serviços */}
        <p className="cta-servicos">Escolha um serviço:</p>
        <ul className="container-servicos">
        {
          servicos && servicos.map((servico:servicoProps, index:number) => {
            return (
              <li 
              key={index}
              className="servicos"
              id={`servico-${index}`} 
              onClick={() => handleEscolhaServico(index, servico)}
              >
                <p>{servico.nome}</p>
              </li>
            )
          })
        }
        </ul>

        {/* Display do Calendário de Agendamento */}
        {servicoEscolhido && (<>

          {/* Lembrete de que já existe um agendamento feito pelo cliente */}
          <span className={dataLembrete.getTime() < new Date().getTime() ? "lembrete-dias" : "lembrete-dias mostrar"}>
          Bem vind@ de volta! Lembrando que já possui agendamentos em 
          <span>&nbsp;{[
            dataLembrete.getDate().toString().padStart(2, '0'),
            (dataLembrete.getMonth() + 1).toString().padStart(2, '0'),
            dataLembrete.getFullYear().toString(),].join('/')
          }</span>.
          </span>

          {/* Chamada do Calendário */}
          <nav className='cta-calendario'>
            <button 
            type='button'
            onClick={()=>{
              setWeekCount(weekCount - 1)
              getWeek(weekCount - 1)
            }}>
              <img src={ChevronLeft} alt="Anterior"/>
            </button>
            <p 
            onClick={() => {
              setWeekCount(0)
              getWeek()
            }}>ESCOLHA UMA DATA E HORA</p>
            <button 
            type='button' 
            onClick={()=>{
              setWeekCount(weekCount + 1)
              getWeek(weekCount + 1)
            }}>
              <img src={ChevronRight} alt="Próximo"/>
            </button>
          </nav>

          {/* Calendário de Dias/Horários */}
          <ul className="calendario">
            {week && week.map((day, index) => {

              // Formata a data
              const dataFormatada = [
                day.getDate().toString().padStart(2, '0'),
                (day.getMonth() + 1).toString().padStart(2, '0'),
                day.getFullYear().toString(),
              ].join('/')

              const horarios = listHorarios(dataFormatada)

              return (
              <li key={day.getTime()}>
                <h2>{dataFormatada}</h2>
                <ul>
                { 
                  horarios?.map((h) => {
                    return (
                      <li key={Math.random()*10000} onClick={() => handleClickHorario(dataFormatada, h)}>
                        {h.toString().padStart(2, '0')}:00
                      </li>
                    )
                  })
                }
                </ul>
              </li>
              )
            })}
          </ul>
        </>)}

      </div>
    </section>

    {/* Instanciação do modal de confirmação do agendamento */}
    {
      servicoEscolhido && (
      <ModalConfirmarAgendamento
      mostrar={abrirModalConfirmacao}
      servico_nome={servicoEscolhido.nome}
      servico_preco={servicoEscolhido.preco}
      data={dataModalConfirmacao}
      horario={horarioModalConfirmacao}
      agendarFun={(s) => {
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
        getWeek()
        getHorariosOcupados()
        getAgendamentosExistentes()
      }}
      closeFun={()=>setAbrirModalConfirmacao(false)}
      warnFun={(s)=>{
        toast.warn(s, {
            position: "top-left",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
      }}
      />)
    }
  </>)
}

export default Agendar