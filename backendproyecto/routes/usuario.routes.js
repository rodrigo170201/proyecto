const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware");

module.exports = (app) => {
    const router = require("express").Router();
    const usuarioController = require("../controller/usuario.controller");

    router.get('/', usuarioController.listUsuarios);
    router.get('/:id', usuarioController.getUsuarioById);
    router.post('/', usuarioController.createUsuario);
    router.patch('/:id/edit', usuarioController.updateUsuario);
    router.delete('/:id',userRequiredMiddleware, usuarioController.deleteUsuario);

    app.use('/usuarios', router);
};
