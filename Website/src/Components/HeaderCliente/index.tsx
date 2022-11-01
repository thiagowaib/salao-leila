// * Importações
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'

import './index.scss'
import LogoutSVG from '../../Assets/Icons/logout.svg'


// Tipagem das propriedades do componente
interface props {
    atual: "Agendar"|"Agendamentos"
}

/**
 * Componente do Cabeçalho do Painel do Cliente
 */
const HeaderCliente = (props:props) => {

    const navigate = useNavigate()                      // Objeto de Navegação
    const {JWT, setJWT} = React.useContext(Context)     // JWT Resultado do React Context

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

    // Ao carregar o elemento, valida o JWT do usuário
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