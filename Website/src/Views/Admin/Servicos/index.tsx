// * Importações
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { HeaderAdmin, Context, ModalCriarServico, ModalModificarServico, ModalExcluirServico } from '../../../Components'

import './index.scss'
import MenuBolinhas from '../../../Assets/Icons/menu-bolinhas.svg'

/**
 * Tela de gerenciamento de Serviços
 * no painel administrativo
 */
const Servicos = () => {

  // Tipagem do objeto {serviço}
  interface servicoProps {
    _id: string,
    nome: string,
    preco: number,
    createdAt: string,
    updatedAt: string,
    __v: number
  }

  // Tipagem do array de objetos {serviço}[]
  interface servicosProps {
    [x: string]: any
    servicos: servicoProps[]
  }

  const navigate = useNavigate()  // Objeto de Navegação

  const {JWT} = React.useContext(Context) // JWT resultado do Login

  const [servicos, setServicos] = React.useState<servicosProps>()             //Array de Serviços
  const [abrirModalCriar, setAbrirModalCriar] = React.useState(false)         //Controlador do Display do Modal de Criar Serviço
  const [abrirModalModificar, setAbrirModalModificar] = React.useState(false) //Controlador do Display do Modal de Modificar Serviço
  const [abrirModalExcluir, setAbrirModalExcluir] = React.useState(false)     //Controlador do Display do Modal de Excluir Serviço
  const [nomeModalServico, setNomeModalServico] = React.useState("")          //Nome do Serviço para os Modais
  const [precoModalServico, setPrecoModalServico] = React.useState("")        //Preço do Serviço para os Modais

  // Realiza a busca dos serviços
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

  // Lida com o botão de criação de serviços
  const handleBtnCriar = () => {
    setAbrirModalCriar(true)
  }

  // Lida com o botão de modificação de serviço
  const handleBtnModificar = (nome:string, preco:string) => {
    setNomeModalServico(nome)
    setPrecoModalServico(preco)
    setAbrirModalModificar(true)
  }

  // Lida com o botão de exclusão de serviço
  const handleBtnExcluir = (nome:string, preco:string) => {
    setNomeModalServico(nome)
    setPrecoModalServico(preco)
    setAbrirModalExcluir(true)
  }

  // Lida com o botão de voltar para a tela anterior
  const handleVoltar = () => {
    navigate('/admin/menu')
  }

  // Ao carregar a View, executa a busca dos serviços
  React.useEffect(getServicos, [JWT])

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
    <section className="admin-servicos">
        <HeaderAdmin/>

        {/* Botão de Voltar */}
        <div className="voltar">
          <span onClick={handleVoltar}>[Voltar]</span>
          <span className="hidden">[Voltar]</span>
        </div>

        {/* Título e [CRIAR SERVIÇO] */}
        <div className="container-titulo">
          <h1>Gerenciamento de Servicos</h1>
          <button type='button' onClick={handleBtnCriar}>
            + Novo Serviço
          </button>
        </div>

        {/* Lista de Serviços */}
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
                      <button className="modificar" onClick={() => handleBtnModificar(servico.nome, servico.preco.toString())}>Modificar</button>
                      <button className="excluir" onClick={() => handleBtnExcluir(servico.nome, servico.preco.toString())}>Excluir</button>
                    </div>
                  </div>
                </div>
                <p className="preco">R${servico.preco},00</p>
              </li>
            )
          })
        }
        </ul>

        {/* Instanciação dos Modais (Criar, Modificar, Excluir) */}
        <ModalCriarServico 
        mostrar={abrirModalCriar} 
        closeFun={()=>setAbrirModalCriar(false)}
        criarFun={(s)=>{
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
          getServicos()
        }}
        />

        <ModalModificarServico 
        mostrar={abrirModalModificar}
        nome={nomeModalServico}
        preco={precoModalServico}
        closeFun={()=>setAbrirModalModificar(false)}
        modificarFun={(s)=>{
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
          getServicos()
        }}
        />

        <ModalExcluirServico 
        mostrar={abrirModalExcluir}
        nome={nomeModalServico}
        preco={precoModalServico}
        closeFun={()=>setAbrirModalExcluir(false)}
        excluirFun={(s)=>{
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
          getServicos()
        }}
        />
    </section>
    </>)
}

export default Servicos