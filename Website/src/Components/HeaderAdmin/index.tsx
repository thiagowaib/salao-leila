import React from 'react'
import './index.scss'

import LogoSVG from '../../Assets/Icons/logo.svg'
import LogoutSVG from '../../Assets/Icons/logout.svg'

import Context from '../Context'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const HeaderAdmin = () => {

  const {JWT, setJWT} = React.useContext(Context)
  const navigate = useNavigate()

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

  // Ao carregar componente, valida o JWT
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