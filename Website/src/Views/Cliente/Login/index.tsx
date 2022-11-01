// * Importações
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Context, ContextCliente } from '../../../Components';
import { ToastContainer, toast } from 'react-toastify'
import { motion } from "framer-motion"

import './index.scss'
import BannerSalao from '../../../Assets/Images/banner-salao.jpg';
import Logo from '../../../Assets/Icons/logo.svg'

/**
 * Tela de Login do Painel do Cliente
 */
const Login = () => {

  const navigate = useNavigate()  // Objeto de Navegação

  const [email, setEmail] = React.useState("")            //Valor do Input de Email
  const [senha, setSenha] = React.useState("")            //Valor do Input de Senha
  const [btnDisable, setBtnDisable] = React.useState(true)//Controla o Disable do botão de "Entrar"

  const {setClienteEmail} = React.useContext(ContextCliente)//Atribuidor do Email do Cliente, provido pelo React Context
  const {setJWT} = React.useContext(Context)                //Atribuidor de JWT, provido pelo React Context

  // Lida com o campo de input do usuário
  const handleInputEmail = (e:any) => {
    const emailRegex = /\S*@\S*\.com/g
    setEmail(e.target.value)
    if(emailRegex.test(e.target.value) && e.target.value !== "" && senha !== "")
      setBtnDisable(false)
    else 
      setBtnDisable(true)
  }

  // Lida com o campo de input da senha
  const handleInputSenha = (e:any) => {
    const emailRegex = /\S*@\S*\.com/g
    setSenha(e.target.value)
    if(emailRegex.test(email) && email !== "" && e.target.value !== "")
        setBtnDisable(false)
      else 
        setBtnDisable(true)
  }

  // Lida com o click do botão de entrar
  const handleClickEntrar = () => {
    axios.post("http://localhost:3000/loginCliente", {
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
      setJWT(res.data.jwt)
      setClienteEmail(email)
      setTimeout(() => navigate("/agendar"), 1000)
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

    <section className="cliente-login">
      <section className="container-esquerda">
        <header>
          <img src={Logo} alt="Salão da Leila"/>
          <h1>Cliente</h1>
          <h2>Login</h2>
        </header>
        <div className="container-inputs">
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
          <button 
          type={"button"}
          onClick={handleClickEntrar}
          disabled={btnDisable}
          >Entrar</button>
          <p className="cta-login">Primeira vez aqui? <span onClick={()=>navigate("/cadastrar")}>Faça seu cadastro</span></p>
        </div>
        <footer>Trabalha no Salão? <span onClick={()=>navigate('/admin')}>Acesse o Painel Administrativo</span></footer>
      </section>
      <section className="container-direita">
        <img src={BannerSalao} alt="Salão de Beleza da Leila"/>
      </section>
    </section>
    </motion.section>
  )
}

export default Login