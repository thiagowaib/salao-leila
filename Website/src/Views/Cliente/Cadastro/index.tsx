import axios from 'axios'
import React from 'react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion"

import './index.scss'
import { useNavigate } from 'react-router-dom';
import BannerSalao from '../../../Assets/Images/banner-salao.jpg';

const Cadastro = () => {

  const navigate = useNavigate()

  const [nome, setNome] = React.useState("")              //Valor do Input de Nome
  const [email, setEmail] = React.useState("")            //Valor do Input de Email
  const [senha, setSenha] = React.useState("")            //Valor do Input de Senha
  const [confSenha, setConfSenha] = React.useState("")    //Valor do Input de Confirmação de Senha
  const [btnDisable, setBtnDisable] = React.useState(true)//Controla o Disable do botão de "Entrar"

  // Lida com o campo de input do nome
  const handleInputNome = (e:any) => {
    const emailRegex = /\S*@\S*\.com/g
    setNome(e.target.value)
    if(emailRegex.test(email) && e.target.value !== "" && email !== "" && senha !== "" && senha===confSenha)
      setBtnDisable(false)
    else 
      setBtnDisable(true)
  }

  // Lida com o campo de input do usuário
  const handleInputEmail = (e:any) => {
    const emailRegex = /\S*@\S*\.com/g
    setEmail(e.target.value)
    if(emailRegex.test(e.target.value) && nome !== "" && e.target.value !== "" && senha !== "" && senha===confSenha)
      setBtnDisable(false)
    else 
      setBtnDisable(true)
  }

  // Lida com o campo de input da senha
  const handleInputSenha = (e:any) => {
    const emailRegex = /\S*@\S*\.com/g
    setSenha(e.target.value)
    if(emailRegex.test(email) && nome !== "" && email !== "" && e.target.value !== "" && e.target.value===confSenha)
        setBtnDisable(false)
      else 
        setBtnDisable(true)
  }

  // Lida com o campo de input da confirmação de senha
  const handleInputConfSenha = (e:any) => {
    const emailRegex = /\S*@\S*\.com/g
    setConfSenha(e.target.value)
    if(emailRegex.test(email) && nome !== "" && email !== "" && senha !== "" && senha===e.target.value)
        setBtnDisable(false)
      else 
        setBtnDisable(true)
  }

  // Lida com o click do botão de entrar
  const handleClickCriar = () => {
    axios.post("http://localhost:3000/novoCliente", {
      nome: nome,
      email: email,
      senha: senha
    })
    .then((res) => {
      toast.success(res.data.message, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      });

      setTimeout(() => navigate('/'), 1000)
    })
    .catch((err) => {
      switch (err.response.status) {
        case 500:   //Erro(500)
          toast.error(err.response.data.message, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
          if(err.response.data.error !== undefined) console.error({ResponseError: err.response.data.error})
          break;
        default:    //Erro(400)
          toast.warn(err.response.data.message, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
          if(err.response.data.error !== undefined) console.error({ResponseError: err.response.data.error})
          break;
      }
    })
  }

  return (
    <motion.section 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0, transition: {duration:0.2} }}
    >
      
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

    <section className="cliente-cadastro">
      <section className="container-esquerda">
        <header>
          <h1>Cliente</h1>
          <h2>Cadastro</h2>
        </header>
        <div className="container-inputs">
          <div className="container-input">
            <label htmlFor="input-nome">Nome</label>
            <input 
            id="input-nome" 
            type={"text"}
            value={nome}
            onInput={handleInputNome}
            />
          </div>
          <div className="container-input">
            <label htmlFor="input-email">Email</label>
            <input 
            id="input-email" 
            type={"email"}
            value={email}
            onInput={handleInputEmail}
            />
          </div>
          <div className="container-input">
            <label htmlFor="input-senha">Senha</label>
            <input 
            id="input-senha" 
            type={"password"}
            value={senha}
            onInput={handleInputSenha}
            />
          </div>
          <div className="container-input">
            <label htmlFor="input-confSenha">Confirmar Senha</label>
            <input 
            id="input-confSenha" 
            type={"password"}
            value={confSenha}
            onInput={handleInputConfSenha}
            />
          </div>
          <button 
          type={"button"}
          onClick={handleClickCriar}
          disabled={btnDisable}
          >Entrar</button>
          <p className="cta-login">Já possui cadastro? <span onClick={()=>navigate("/")}>Faça seu Login</span></p>
        </div>
      </section>
      <section className="container-direita">
        <img src={BannerSalao} alt="Salão de Beleza da Leila"/>
      </section>
    </section>
    </motion.section>
  )
}

export default Cadastro