/**
 * Definição de um React Context para
 * armazenar e propagar o email do cliente
 * resultado do Login
 */

import React from 'react'

interface ContextProps {
    clienteEmail: string;
    setClienteEmail: React.Dispatch<React.SetStateAction<string>>;
}

const ContextCliente = React.createContext<ContextProps>({clienteEmail: "", setClienteEmail: () => {}})

export default ContextCliente