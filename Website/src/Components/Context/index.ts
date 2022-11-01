/**
 * Definição de um React Context para
 * armazenar e propagar o JWT resultado do Login
 */

import React from 'react'

interface ContextProps {
    JWT: string;
    setJWT: React.Dispatch<React.SetStateAction<string>>;
}

const Context = React.createContext<ContextProps>({JWT: "", setJWT: () => {}})

export default Context