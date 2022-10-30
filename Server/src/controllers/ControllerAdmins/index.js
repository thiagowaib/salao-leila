// * Importações
const jwt = require('jsonwebtoken')
const { Admins } = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {
    
    /**
     * @api {post} /novoAdmin Criar novo objeto Admin
     * @apiName novoAdmin
     * @apiGroup Admins
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhuma
     * 
     * @apiBody {String} usuario Nome de usuário para o admin
     * @apiBody {String} senha Senha para o admin  
     * 
     * @apiSuccessExample Sucesso(201):
     * {
     *  message: "Admin cadastrado com sucesso"
     * }
     * @apiErrorExample Erro(400):
     * {
     *  message: "Admin já existente"
     * }
     * @apiErrorExample Erro(500):
     * {
     *  message: "Erro de Servidor",
     *  error: {ErrorObject}
     * }
     */
    novoAdmin(req, res){
        const {usuario, senha} = req.body

        Admins.findOne({usuario}, async(err, obj) => {
            // Validação de erro e duplicata de usuário admin
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj) return res.status(400).send({message: "Usuário admin já existente"})

            // Processo de criptografia da senha
            const {HashPwd} = require('../../services')
            const senhaHashed = await HashPwd(senha)

            // Criação do novo objeto
            const novoAdmin = new Admins({
                usuario: usuario,
                senha: senhaHashed
            })
    
            // Salvamento do novo objeto
            novoAdmin.save((err)=>{
                if(err) return res.status(500).send({message: "Falha ao cadastrar admin", error: err})
                else return res.status(201).send({message: "Admin cadastrado com sucesso"})
            })
        })
    },

    /**
     * @api {post} /loginAdmin Login
     * @apiName loginAdmin
     * @apiGroup Admins
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhuma
     * 
     * @apiBody {String} usuario Usuário do Admin
     * @apiBody {String} senha Senha do Admin
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
    loginAdmin(req, res){
        const {usuario, senha} = req.body
        const {AuthPwd, SetExpDate} = require('../../services')

        Admins.findOne({usuario}, async(err, obj) => {
            // Validação de erro e usuário não encontrado
            if(err) return res.status(500).send({message: "Erro de servidor", error: err})
            if(obj===null) return res.status(404).send({message: "Usuário não encontrado"})

            // Autentifica a senha inserida
            if(await AuthPwd(obj.senha, senha)) {
                // Dados inbutidos no JWT
                const jwtPayload = {
                    belongsTo: "Admins",
                    exp: SetExpDate(Date.now(), 1, "d")
                }

                // Token de Acesso enviado ao usuário p/ autentificar
                const tokenAcesso = jwt.sign(
                    jwtPayload,
                    process.env.JWT_ACCESS_TOKEN_SECRET
                )
                return res.status(200).send({message: "Login bem-sucedido", jwt: tokenAcesso})
            } else {
                return res.status(401).send({message: "Senha invalida"})
            }
        })
    }
}
