import React from 'react'

interface ContextProps {
    clienteEmail: string;
    setClienteEmail: React.Dispatch<React.SetStateAction<string>>;
}

const ContextCliente = React.createContext<ContextProps>({clienteEmail: "", setClienteEmail: () => {}})

export default ContextCliente