const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware");

module.exports = (app) => {
    const router = require("express").Router();
    const municipioController = require("../controller/municipio.controller");

    router.get('/', municipioController.listMunicipios);
    router.get('/:id', municipioController.getMunicipioById);
    router.post('/', userRequiredMiddleware,municipioController.createMunicipio);
    router.patch('/:id/edit', userRequiredMiddleware,municipioController.updateMunicipio);
    router.delete('/:id',userRequiredMiddleware, municipioController.deleteMunicipio);

    app.use('/municipios', router);
};
