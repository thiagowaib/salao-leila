import { motion } from "framer-motion"
import { HeaderAdmin } from '../../../Components'

import './index.scss'

const Menu = () => {

  const handleBtnServicos = () => {
    // TODO: Navegar para Página de Gerenciamento de Serviços
  }

  return (
    <motion.section 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0, transition: {duration:0.2} }}
    >
    <section className="admin-menu">
        <HeaderAdmin/>

        <div className="container-titulo">
          <h1>Menu</h1>
          <h2>Escolha uma opção abaixo</h2>
        </div>

        <div className="container-menu">
          <button type='button' onClick={handleBtnServicos}>
            Gerenciar Serviços
          </button>
        </div>

    </section>
    </motion.section>
  )
}

export default Menu