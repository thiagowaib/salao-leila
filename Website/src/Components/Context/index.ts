import React from 'react'

interface ContextProps {
    JWT: string;
    setJWT: React.Dispatch<React.SetStateAction<string>>;
}

const Context = React.createContext<ContextProps>({JWT: "", setJWT: () => {}})

export default Context