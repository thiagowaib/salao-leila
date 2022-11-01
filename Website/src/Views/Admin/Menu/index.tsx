// * Importações
import { useNavigate } from "react-router-dom"
import { HeaderAdmin } from '../../../Components'

import './index.scss'

/**
 * Menu de Opções do Painel Administrativo
 */
const Menu = () => {

  const navigate = useNavigate()  // Objeto de Navegação

  // Lida com a navegação do menu
  const handleBtnServicos = () => {
    navigate('/admin/servicos')
  }

  return (
    <>
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
    </>
  )
}

export default Menu