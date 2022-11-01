// * Importações
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'

// * Componentes
import { Login as LoginAdmin, Menu, Servicos }from '../../Views/Admin';
import { Login as LoginCliente, Cadastro, Agendar, Agendamentos } from '../../Views/Cliente';

// * Importação dos Contextos
import Context from '../Context';
import ContextCliente from '../ContextCliente';

const AnimatedRoutes = () => {
    const location = useLocation()

    // Definição de Contextos
    const [JWT, setJWT] = React.useState("")
    const [clienteEmail, setClienteEmail] = React.useState("")

    // Roteamento de Views
    return (
    <Context.Provider value={{JWT, setJWT}}>
        <ContextCliente.Provider value={{clienteEmail, setClienteEmail}}>
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LoginCliente/>}/>
                <Route path="/cadastrar" element={<Cadastro/>}/>
                <Route path="/agendar" element={<Agendar/>}/>
                <Route path="/Agendamentos" element={<Agendamentos/>}/>
                <Route path="/admin" element={<LoginAdmin/>}/>
                <Route path="/admin/menu" element={<Menu/>}/>
                <Route path="/admin/servicos" element={<Servicos/>}/>
            </Routes>
        </AnimatePresence>
        </ContextCliente.Provider>
    </Context.Provider>
    )
}

export default AnimatedRoutes