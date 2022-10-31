import axios from 'axios'
import React from 'react'
import { HeaderCliente,Context } from '../../../Components'
import { ToastContainer, toast } from 'react-toastify'

import './index.scss'
import ChevronRight from '../../../Assets/Icons/chevron-right.svg'
import ChevronLeft from '../../../Assets/Icons/chevron-left.svg'
import ModalConfirmarAgendamento from '../../../Components/ModalConfirmarAgendamento'

const Agendar = () => {

  interface servicoProps {
    _id: string,
    nome: string,
    preco: number,
    createdAt: string,
    updatedAt: string,
    __v: number
  }

  interface servicosProps {
    [x: string]: any
    servicos: servicoProps[]
  }

  const {JWT} = React.useContext(Context)
  const [servicos, setServicos] = React.useState<servicosProps>()
  const [servicoEscolhido, setServicoEscolhido] = React.useState<servicoProps>()
  const [week, setWeek] = React.useState<Date[]>()
  const [weekCount, setWeekCount] = React.useState(0)
  const [horariosOcupados, setHorariosOcupados] = React.useState<any>(null)
  let horariosLivres:number[] = [8, 9, 10, 11, 13, 14, 15, 16, 17]

  const [abrirModalConfirmacao, setAbrirModalConfirmacao] = React.useState(false)
  const [dataModalConfirmacao, setDataModalConfirmacao] = React.useState("")
  const [horarioModalConfirmacao, setHorarioModalConfirmacao] = React.useState("")

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

  const handleClickHorario = (dataFormatada:string, hora:number) => {
    setAbrirModalConfirmacao(true)
    setDataModalConfirmacao(dataFormatada)
    setHorarioModalConfirmacao(`${hora.toString().padStart(2,'0')}:00`)
  }

  React.useEffect(() => {
    getServicos()
    getWeek()
    getHorariosOcupados()
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

        {servicoEscolhido && (<>
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
      }}
      closeFun={()=>setAbrirModalConfirmacao(false)}
      />)
    }
  </>)
}

export default Agendar