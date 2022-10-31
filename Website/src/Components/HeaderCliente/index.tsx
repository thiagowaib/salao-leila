import React from 'react'
import './index.scss'

import LogoutSVG from '../../Assets/Icons/logout.svg'

import Context from '../Context'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface props {
    atual: "Agendar"|"Agendamentos"
}
const HeaderCliente = (props:props) => {

    const {JWT, setJWT} = React.useContext(Context)
    const navigate = useNavigate()

    // Lida com a função de logout
    const handleBtnLogout = () => {
        setJWT("")
        navigate("/")
    }

    // Autentifica o JWT, caso falhe retorna o usuário ao login
    const validateJWT = () => {
        axios({
        method: "get",
        url: "http://localhost:3000/authJWT",
        headers: {"auth": JWT}
        })
        .then((res) => {
        if(res.data.belongsTo !== "Clientes")
            navigate("/")
        else
            console.log("JWT Autenticado")
        })
        .catch((err) => {
            console.warn(err.response.data.message)
            navigate("/")
        })
    }

    React.useEffect(validateJWT, [JWT, navigate])


    return (
        <header className="components-headercliente">
            <button type='button' onClick={handleBtnLogout}>
                <img className="logout" src={LogoutSVG} alt="Logout"/>
                <p>Logout</p>
            </button>
            <nav>
                <p className={props.atual==="Agendar"?"atual":""} onClick={()=>navigate('/agendar')}>Agendar</p>
                <p className={props.atual==="Agendamentos"?"atual":""}onClick={()=>navigate('/agendamentos')}>Meus Agendamentos</p>
            </nav>
        </header>
    )
}

export default HeaderCliente