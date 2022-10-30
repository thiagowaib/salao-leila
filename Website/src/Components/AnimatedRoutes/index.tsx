import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import { Login as LoginAdmin, Menu }from '../../Views/Admin';
import { Login as LoginCliente } from '../../Views/Cliente';

import { AnimatePresence } from 'framer-motion'
import Context from '../Context';

const AnimatedRoutes = () => {
    const location = useLocation()

    const [JWT, setJWT] = React.useState("")

    return (
    <Context.Provider value={{JWT, setJWT}}>
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LoginCliente/>}/>
                <Route path="/admin" element={<LoginAdmin/>}/>
                <Route path="/admin/menu" element={<Menu/>}/>
            </Routes>
        </AnimatePresence>
    </Context.Provider>
    )
}

export default AnimatedRoutes