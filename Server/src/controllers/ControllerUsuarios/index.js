// * Exportação dos métodos do Controller
module.exports = {
    /**
     * @api {get} /authJWT Autêntifica JWT
     * @apiName authJWT
     * @apiGroup Usuários
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin | Clientes
     * 
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiSuccessExample Sucesso(200):
     * {
     *  message: "JWT autenticado",
     *  belongsTo: "Admins"||"Clientes"
     * }
     */
    authJWT(req, res) {
        return res.status(200).send({message: "JWT autenticado", belongsTo: req.payload.belongsTo})
    }
}