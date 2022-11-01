// * Importações
import React from 'react'
import axios from 'axios'
import { Context } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import { motion } from "framer-motion"


import './index.scss'
import BannerSalao from '../../../Assets/Images/banner-salao.jpg';
import Logo from '../../../Assets/Icons/logo.svg'

/**
 * Tela de Login do Painel Admin
 */
const Login = () => {

  const navigate = useNavigate()  // Objeto de Navegação

  const {setJWT} = React.useContext(Context)              //Atribuidor de JWT, provido pelo React Context

  const [usuario, setUsuario] = React.useState("")        //Valor do Input de Usuário
  const [senha, setSenha] = React.useState("")            //Valor do Input de Senha
  const [btnDisable, setBtnDisable] = React.useState(true)//Controla o Disable do botão de "Entrar"

  // Lida com o campo de input do usuário
  const handleInputUsuario = (e:any) => {
    setUsuario(e.target.value)
    if(e.target.value !== "" && senha !== "")
      setBtnDisable(false)
    else 
      setBtnDisable(true)
  }

  // Lida com o campo de input da senha
  const handleInputSenha = (e:any) => {
    setSenha(e.target.value)
    if(usuario !== "" && e.target.value !== "")
      setBtnDisable(false)
    else 
      setBtnDisable(true)
  }

  // Lida com o click do botão de entrar
  const handleClickEntrar = () => {
    axios.post("http://localhost:3000/loginAdmin", {
      usuario: usuario,
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
      setJWT(res.data.jwt)  //Salva o JWT no state do contexto

      setTimeout(() => navigate('/admin/menu'), 1000)
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
        default:    //Erro(401, 404)
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

    <section className="admin-login">
      <section className="container-esquerda">
        <header>
          <img src={Logo} alt="Salão da Leila"/>
          <h1>Login</h1>
          <h2>Painel Administrativo</h2>
        </header>
        <div className="container-inputs">
          <div className="container-input">
            <label htmlFor="input-usuario">Usuário Admin</label>
            <input 
            id="input-usuario" 
            type={"text"}
            value={usuario}
            onInput={handleInputUsuario}
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
        </div>
        <footer>É um cliente? <span onClick={()=>navigate('/')}>Acesse o Painel do Cliente</span></footer>

      </section>
      <section className="container-direita">
        <img src={BannerSalao} alt="Salão de Beleza da Leila"/>
      </section>
    </section>
    </motion.section>
  )
}

export default Login