import axios from 'axios'
import React from 'react'
import { HeaderAdmin, Context } from '../../../Components'

import './index.scss'
import MenuBolinhas from '../../../Assets/Icons/menu-bolinhas.svg'
import { useNavigate } from 'react-router-dom'

const Servicos = () => {

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
  const navigate = useNavigate()

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
      console.error(err.response.data)
    })
  }

  // Lida com o mostrar/esconder das opções de modificar e excluir dos serviços
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

  const handleBtnModificar = (id:string) => {
    // TODO: Inserir função de abrir modal
  }

  const handleBtnExcluir = (id:string) => {
    // TODO: Inserir função de abrir modal
  }

  const handleVoltar = () => {
    navigate('/admin/menu')
  }

  React.useEffect(getServicos, [])

  return (<>
    <section className="admin-servicos">
        <HeaderAdmin/>

        <div className="voltar">
          <span onClick={handleVoltar}>[Voltar]</span>
          <span className="hidden">[Voltar]</span>
        </div>

        <div className="container-titulo">
          <h1>Gerenciamento de Servicos</h1>
          <button type='button'>
            + Novo Serviço
          </button>
        </div>

        <h2>Lista de Serviços</h2>
        <ul className="container-servicos">
        { 
          servicos && servicos.map((servico:servicoProps, index:number) => {
            return (
              <li className="servico" key={index}>
                <div className="card">
                  <p className="nome">{servico.nome}</p>
                  <div className="container-opcoes">
                    <img src={MenuBolinhas} alt="Opções" onClick={() => handleBtnOpcoes(index)}/>
                    <div id={`opcoes-${index}`} className="opcoes">
                      <button className="modificar" onClick={() => handleBtnModificar(servico._id)}>Modificar</button>
                      <button className="excluir" onClick={() => handleBtnExcluir(servico._id)}>Excluir</button>
                    </div>
                  </div>
                </div>
                <p className="preco">R${servico.preco},00</p>
              </li>
            )
          })
        }
        </ul>

    </section>
    </>)
}

export default Servicos