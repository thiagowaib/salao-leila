// * Importações
const { Agendamentos, Servicos, Clientes } = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {

    /**
     * @api {post} /agendar Realizar Agendamento
     * @apiName agendar
     * @apiGroup Agendamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Clientes
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} data Data do agendamento
     * @apiBody {Number} inicio Início (hora) do agendamento
     * @apiBody {String} servico_nome Nome do serviço
     * @apiBody {String} cliente_email Email do cliente
     * 
     * @apiSuccessExample Sucesso(201):
     * {
     *  message: "Agendamento realizado com sucesso"
     * }
     * @apiErrorExample Erro(400):
     * {
     *  message: "Data/hora indisponíveis"
     * }
     * @apiErrorExample Erro(404):
     * {
     *  message: "Serviço||Cliente não encontrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    async agendar(req, res) {
        if(req.payload.belongsTo !== "Clientes") return res.status(403).send({message: "Permissão negada [Clientes]"})
        const { data, inicio, servico_nome, cliente_email} = req.body
        
        Agendamentos.findOne({data, inicio}, async(err, obj) => {
            // Validação de erro e agendamento já realizado
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj) return res.status(400).send({message: "Data/hora indisponíveis"})

            // Busca o serviço referente ao agendamento
            const queryRegex = new RegExp(`${servico_nome}$`)
            const servico = await Servicos.findOne({nome: {$regex: queryRegex, $options: 'g'}})
            if(servico===null) return res.status(404).send({message: "Serviço não encontrado"})
        
            // Busca o cliente referente ao agendamento
            const cliente = await Clientes.findOne({cliente_email})
            if(cliente===null) return res.status(404).send({message: "Cliente não encontrado"})

            const novoAgendamento = new Agendamentos({
                data: data,
                inicio: inicio,
                valor: servico.preco,
                servico_nome: servico.nome,
                servico_id: servico._id.toString(),
                cliente_nome: cliente.nome,
                cliente_id: cliente._id.toString()
            })

            novoAgendamento.save((err) => {
                if(err) return res.status(500).send({message: "Falha ao realizar agendamento", error: err})
                else return res.status(201).send({message: "Agendamento realizado com sucesso"})
            })
        })
    }
}