// * Importações
const { Servicos, Agendamentos } = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {


    /**
     * @api {post} /novoServico Criar novo objeto Serviço
     * @apiName novoServico
     * @apiGroup Serviços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admins
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * 
     * @apiBody {String} nome Nome do serviço
     * @apiBody {Number} preco Preço do serviço
     * 
     * @apiSuccessExample Sucesso(201):
     * {
     *  message: "Serviço cadastrado com sucesso"
     * }
     * @apiErrorExample Erro(400):
     * {
     *  message: "Serviço já cadastrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    novoServico(req, res) {
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [Admins]"})
        
        const {nome, preco} = req.body

        const queryRegex = new RegExp(`${nome}$`)
        Servicos.findOne({nome: {$regex: queryRegex, $options: 'g'}}, (err, obj) => {
            // Validação de erro e duplicata de objeto
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj) return res.status(400).send({message: "Serviço já cadastrado"})

            // Criação do novo objeto
            const novoServico = new Servicos({
                nome,
                preco,
            })

            // Salvamento do novo objeto
            novoServico.save((err)=>{
                if(err) return res.status(500).send({message: "Falha ao cadastrar serviço", error: err})
                else return res.status(201).send({message: "Serviço cadastrado com sucesso"})
            })
        })
    },

    /**
     * @api {get} /buscarServicos Buscar Serviços
     * @apiName buscarServicos
     * @apiGroup Serviços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admins
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  message: "Busca feita",
     *  servicos: [{ObjetoServico}, ...]
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    buscarServicos(req, res) {
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [Admins]"})

        Servicos.find({}, (err, objs) => {
            // Validação de erro
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})

            // Retorna os serviços
            return res.status(200).send({message: "Busca feita", servicos: objs})
        })
    },

    /**
     * @api {put} /modificarServico Modificar Serviço
     * @apiName modificarServico
     * @apiGroup Serviços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admins
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} nome Nome do serviço em questão
     * @apiBody {String} [novoNome] Novo nome
     * @apiBody {String} [novoPreco] Novo preço
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  message: "Alterações salvas com sucesso"
     * }
     * @apiErrorExample Erro(403):
     * {
     *  message: "Impossível alterar nome do serviço enquanto há agendamentos pendentes com ele"
     * }
     * @apiErrorExample Erro(404):
     * {
     *  message: "Serviço não encontrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    modificarServico(req, res) {
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [Admins]"})
        
        const {nome, novoNome, novoPreco} = req.body

        const queryRegex = new RegExp(`${nome}$`)
        Servicos.findOne({nome: {$regex: queryRegex, $options: 'g'}}, async (err, obj) => {
            // Validação de erro e objeto inexistente
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj===null) return res.status(404).send({message: "Serviço não encontrado"})

            // Confere se existem agendamentos pendentes com esse serviço
            const agendamentos = await Agendamentos.find({servico_id: obj._id.toString()})
            const agendamentosFuturos = agendamentos.filter((agendamento) => {
                const diaAgendamento = agendamento.data.split("/")[0]
                const mesAgendamento = agendamento.data.split("/")[1]
                const anoAgendamento = agendamento.data.split("/")[2]
                const dataAgendamento = new Date(anoAgendamento, parseInt(mesAgendamento)-1, diaAgendamento)

                return dataAgendamento.getTime() > new Date().getTime()
            })

            // Impede a alteração do nome caso hajam pendências
            if(agendamentosFuturos.length > 0 && novoNome !== nome && novoNome !== "") return res.status(403).send({message: "Impossível alterar nome do serviço enquanto há agendamentos pendentes com ele"})
            
            if(novoNome && novoNome!=="") obj.nome = novoNome
            if(novoPreco && novoPreco>=0) obj.preco = novoPreco

            obj.save((err)=>{
                if(err) return res.status(500).send({message: "Falha ao salvar alterações", error: err})
                else return res.status(200).send({message: "Alterações salvas com sucesso"})
            })
        })
    },

    /**
     * @api {delete} /removerServico Remover Serviço
     * @apiName removerServico
     * @apiGroup Serviços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admins
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} nome Nome do serviço em questão
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  message: "Serviço descadastrado com sucesso"
     * }
     * @apiErrorExample Erro(403):
     * {
     *  message: "Impossível alterar nome do serviço enquanto há agendamentos pendentes com ele"
     * }
     * @apiErrorExample Erro(404):
     * {
     *  message: "Serviço não encontrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    removerServico(req, res) {
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [Admins]"})
        
        const {nome} = req.body

        const queryRegex = new RegExp(`${nome}$`)
        Servicos.findOne({nome: {$regex: queryRegex, $options: 'g'}}, async (err, obj) => {
            // Validação de erro e objeto inexistente
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj===null) return res.status(404).send({message: "Serviço não encontrado"})

            // Confere se existem agendamentos pendentes com esse serviço
            const agendamentos = await Agendamentos.find({servico_id: obj._id.toString()})
            const agendamentosFuturos = agendamentos.filter((agendamento) => {
                const diaAgendamento = agendamento.data.split("/")[0]
                const mesAgendamento = agendamento.data.split("/")[1]
                const anoAgendamento = agendamento.data.split("/")[2]
                const dataAgendamento = new Date(anoAgendamento, parseInt(mesAgendamento)-1, diaAgendamento)

                return dataAgendamento.getTime() > new Date().getTime()
            })

            // Impede a alteração do nome caso hajam pendências
            if(agendamentosFuturos.length > 0 && novoNome !== nome && novoNome !== "") return res.status(403).send({message: "Impossível remover o serviço enquanto há agendamentos pendentes com ele"})

            // Remove os agendamentos que incluiam o serviço
            agendamentos.forEach((agendamento) => {
                Agendamentos.findByIdAndRemove(agendamento._id.toString(), (err) => {
                    if(err) return res.status(500).send({message: "Erro de servidor", error: err})
                })
            })

            // Remove o Serviço
            Servicos.findByIdAndRemove(obj._id.toString(), (err) => {
                if(err) return res.status(500).send({message: "Erro de servidor", error: err})
                else return res.status(200).send({message: "Serviço descadastrado com sucesso"})
            })
        })
    }
}
