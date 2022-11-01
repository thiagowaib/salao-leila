// * Importações
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'

import './index.scss'
import LogoSVG from '../../Assets/Icons/logo.svg'
import LogoutSVG from '../../Assets/Icons/logout.svg'


/**
 * Componente do Cabeçalho do Painel Administrativo
 */
const HeaderAdmin = () => {

  const navigate = useNavigate()                  // Objeto de Navegação
  const {JWT, setJWT} = React.useContext(Context) // JWT Resultado do React Context

  // Lida com a função de logout do painel adminstrativo
  const handleBtnLogout = () => {
    setJWT("")
    navigate("/admin")
  }

  // Autentifica o JWT, caso falhe retorna o usuário ao login
  const validateJWT = () => {
    axios({
      method: "get",
      url: "http://localhost:3000/authJWT",
      headers: {"auth": JWT}
    })
    .then((res) => {
      if(res.data.belongsTo !== "Admins")
        navigate("/admin")
      else
        console.log("JWT Autenticado")
    })
    .catch((err) => {
      console.warn(err.response.data.message)
      navigate("/admin")
    })
  }

  // Ao carregar o elemento, valida o JWT do usuário
  React.useEffect(validateJWT, [JWT, navigate])
  
  return (
    <header className="components-headeradmin">
      <img className="logo" src={LogoSVG} alt="Salão da Leila"/>
      <button type='button' onClick={handleBtnLogout}>
        <img className="logout" src={LogoutSVG} alt="Logout"/>
        <p>Logout</p>
      </button>
    </header>
  )
}

export default HeaderAdmin