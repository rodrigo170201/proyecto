const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware");

module.exports = (app) => {
    const router = require("express").Router();
    const carreteraController = require("../controller/carretera.controller");

    router.get('/', carreteraController.listCarreteras);
    router.get('/:id', carreteraController.getCarreteraById);
    router.post('/', userRequiredMiddleware,carreteraController.createCarretera);
    router.patch('/:id/edit', userRequiredMiddleware,carreteraController.updateCarretera);
    router.delete('/:id', userRequiredMiddleware,carreteraController.deleteCarretera);

    app.use('/carreteras', router);
};
