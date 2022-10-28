// * Importações
const { Servicos } = require('../../models')

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

        Servicos.findOne({nome}, async(err, obj) => {
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
    }
}
