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

        const diaData = data.split('/')[0]
        const mesData = data.split('/')[1]
        const anoData = data.split('/')[2]
        if(new Date(anoData, parseInt(mesData)-1, diaData).getTime() <= new Date().getTime()) return res.status(400).send({message: "Data está no passado"})
        
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
    },

    /**
     * @api {post} /buscarAgendamentos Buscar Agendamentos
     * @apiName buscarAgendamentos
     * @apiGroup Agendamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admins | Clientes
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} [email] Email do cliente (para busca por cliente)
     * 
     * @apiSuccessExample Sucesso(200) Busca por Cliente [Admin | Cliente]:
     * {
     *  message: "Busca por cliente feita",
     *  agendamentos: [{ObjetoAgendamento}, ...]
     * }
     * @apiSuccessExample Sucesso(200) Busca Geral [Admin]:
     * {
     *  message: "Busca geral feita",
     *  agendamentos: [{ObjetoAgendamento}, ...]
     * }
     * @apiErrorExample Erro(404) Busca por Cliente:
     * {
     *  message: "Cliente não encontrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    async buscarAgendamentos(req, res) {
        const {email} = req.body

        if(email && email!=="") //Busca por cliente
        {
            // Busca o cliente referente ao agendamento
            const cliente = await Clientes.findOne({email})
            if(cliente===null) return res.status(404).send({message: "Cliente não encontrado"})

            Agendamentos.find({cliente_id: cliente._id.toString()}, (err, objs) => {
                // Validação de erro
                if(err) return res.status(500).send({message: "Erro de servidor", error: err})

                // Retorna os agendamentos
                return res.status(200).send({message: "Busca por cliente feita", agendamentos: objs})
            })
        }
        else //Busca geral
        {
            if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [Admins]"})
            Agendamentos.find({}, (err, objs) => {
                // Validação de erro
                if(err) return res.status(500).send({message: "Erro de servidor", error: err})

                // Retorna os agendamentos
                return res.status(200).send({message: "Busca geral feita", agendamentos: objs})
            })
        }
    },

    /**
     * @api {delete} /cancelarAgendamento/:id Cancelar Agendamento
     * @apiName cancelarAgendamentoPorId
     * @apiGroup Agendamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admins | Clientes
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * @apiParam {String} id ObjectId (_id) do agendamento
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  message: "Agendamento cancelado com sucesso"
     * }
     * @apiErrorExample Erro(401):
     * {
     *  message: "Para cancelar um agendamento com menos de 2 dias de antecedência, entre em contato com o Salão de Beleza via telefone"
     * }
     * @apiErrorExample Erro(404):
     * {
     *  message: "Agendamento não encontrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    async cancelarAgendamentoPorId(req, res) {
        const agendamento_id = req.params.id

        // Busca o Agendamento no BD
        const agendamento = await Agendamentos.findById(agendamento_id)
        if(agendamento===null) return res.status(404).send({message: "Agendamento não encontrado"})
        
        // Formata a data do Agendamento
        const diaAgendamento = parseInt(agendamento.data.split("/")[0])
        const mesAgendamento = parseInt(agendamento.data.split("/")[1]) - 1
        const anoAgendamento = parseInt(agendamento.data.split("/")[2])
        const dataAgendamento = new Date(anoAgendamento, mesAgendamento, diaAgendamento)
        
        // Caso o Agendamento aconteca em menos de 2 dias, não permite seu cancelamento
        if(dataAgendamento.getTime() - new Date().getTime() < (1000 * 60 * 60 * 24 * 2))
        return res.status(401).send({
            message: "Para cancelar um agendamento com menos de 2 dias de antecedência, entre em contato com o Salão de Beleza via telefone"
        })

        // Caso contrário, cancela o agendamento
        Agendamentos.findByIdAndRemove(agendamento_id, (err) => {
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            else return res.status(200).send({message: "Agendamento cancelado com sucesso"})
        })
    },

    /**
     * @api {get} /buscarDatasAgendadas Buscar Datas Agendadas
     * @apiName buscarDatasAgendadas
     * @apiGroup Agendamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admins | Clientes
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  "DD/MM/YYYY": [HoraInício{NUMBER}, HoraInício{NUMBER}, ...],
     *  "DD/MM/YYYY": [HoraInício{NUMBER}, HoraInício{NUMBER}, ...],
     *  ...
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    buscarDatasAgendadas(req, res) {

        Agendamentos.find({}, (err, objs) => {
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})

            // Objeto que irá armazenar as datas/horários que contem agendamentos
            let dados = {}

            /**
             * Loop executado através de todos os agendamentos, gerando um objeto compilando:
             * {
             *  "data01": [horáriosOcupados],
             *  "data02": [horáriosOcupados],
             *  ...
             * }
             */
            objs.forEach(obj => {
                // Caso a data não tenha sido incluida como key de {dados}, cria essa key como um array vazio
                if(dados[obj.data] === undefined) 
                    dados[obj.data] = []  
                
                // Insere o horário de início do agendamento no array da key correspondente a data do agendamento
                dados[obj.data].push(obj.inicio)
            })

            return res.status(200).send(dados)
        })
    }
}
