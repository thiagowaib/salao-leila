// * Importações
const jwt = require('jsonwebtoken')
const { Clientes, Agendamentos } = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {
    /**
     * @api {post} /novoCliente Criar novo objeto Cliente
     * @apiName novoCliente
     * @apiGroup Clientes
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhuma
     * 
     * @apiBody {String} usuario Nome do cliente
     * @apiBody {String} email Email do cliente
     * @apiBody {String} senha Senha do cliente
     * 
     * @apiSuccessExample Sucesso(201):
     * {
     *  message: "Cliente cadastrado com sucesso"
     * }
     * @apiErrorExample Erro(400):
     * {
     *  message: "Cliente já cadastrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
     novoCliente(req, res){
        const {nome, email, senha} = req.body

        Clientes.findOne({email}, async(err, obj) => {
            // Validação de erro e duplicata de usuário
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj) return res.status(400).send({message: "Cliente já cadastrado"})

            // Processo de criptografia da senha
            const {HashPwd} = require('../../services')
            const senhaHashed = await HashPwd(senha)

            // Criação do novo objeto
            const novoCliente = new Clientes({
                nome: nome,
                email: email,
                senha: senhaHashed
            })
    
            // Salvamento do novo objeto
            novoCliente.save((err)=>{
                if(err) return res.status(500).send({message: "Falha ao cadastrar cliente", error: err})
                else return res.status(201).send({message: "Cliente cadastrado com sucesso"})
            })
        })
    },

    /**
     * @api {post} /loginCliente Login
     * @apiName loginCliente
     * @apiGroup Clientes
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhuma
     * 
     * @apiBody {String} email Email do cliente
     * @apiBody {String} senha Senha do cliente
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  message: "Login bem-sucedido",
     *  jwt: {String}
     * }
     * @apiErrorExample Erro(401):
     * {
     *  message: "Senha invalida"
     * }
     * @apiErrorExample Erro(404):
     * {
     *  message: "Usuário não encontrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    loginCliente(req, res){
        const {email, senha} = req.body
        const {AuthPwd, SetExpDate} = require('../../services')

        Clientes.findOne({email}, async(err, obj) => {
            // Validação de erro e usuário não encontrado
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj===null) return res.status(404).send({message: "Usuário não encontrado"})

            // Autentifica a senha inserida
            if(await AuthPwd(obj.senha, senha)) {
                // Dados inbutidos no JWT
                const jwtPayload = {
                    belongsTo: "Clientes",
                    exp: SetExpDate(Date.now(), 1, "d")
                }

                // Token de Acesso enviado ao usuário p/ autentificar
                const tokenAcesso = jwt.sign(
                    jwtPayload,
                    process.env.JWT_ACCESS_TOKEN_SECRET
                )
                return res.status(202).send({message: "Login bem-sucedido", jwt: tokenAcesso})
            } else {
                return res.status(401).send({message: "Senha invalida"})
            }
        })
    },

    /**
     * @api {delete} /removerCliente Remover Cliente
     * @apiName removerCliente
     * @apiGroup Clientes
     * @apiVersion 1.0.0
     * 
     * @apiPermission Clientes
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} email Email do cliente
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  message: "Cliente descadastrado com sucesso"
     * }
     * @apiErrorExample Erro(403):
     * {
     *  message: "Impossível descadastrar o cliente enquanto há agendamentos pendentes"
     * }
     * @apiErrorExample Erro(404):
     * {
     *  message: "Cliente não encontrado"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    async removerCliente(req, res){
        if(req.payload.belongsTo !== "Clientes") return res.status(403).send({message: "Permissão negada [Clientes]"})
        const {email} = req.body

        // Busca o Cliente
        const cliente = await Clientes.findOne({email})
        if(cliente===null) return res.status(404).send({message: "Cliente não encontrado"})

        // Confere se existem agendamentos pendentes
        const agendamentos = await Agendamentos.find({cliente_id: cliente._id.toString()})
        const agendamentosFuturos = agendamentos.filter((agendamento) => {
            const diaAgendamento = agendamento.data.split("/")[0]
            const mesAgendamento = agendamento.data.split("/")[1]
            const anoAgendamento = agendamento.data.split("/")[2]
            const dataAgendamento = new Date(anoAgendamento, parseInt(mesAgendamento)-1, diaAgendamento)

            return dataAgendamento.getTime() > new Date().getTime()
        })

        // Impede o descadastro caso haja pendências
        if(agendamentosFuturos.length > 0) return res.status(403).send({message: "Impossível descadastrar o cliente enquanto há agendamentos pendentes"})

        // Remove os agendamentos que foram feitos pelo cliente
        agendamentos.forEach((agendamento) => {
            Agendamentos.findByIdAndRemove(agendamento._id.toString(), (err) => {
                if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            })
        })

        // Remove o cliente
        Clientes.findByIdAndRemove(cliente._id.toString(), (err) => {
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            else return res.status(200).send({message: "Cliente descadastrado com sucesso"})
        })
    }
}
