const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware");

module.exports = (app) => {
    const router = require("express").Router();
    const incidenteController = require("../controller/incidente.controller");

    router.get('/', incidenteController.listIncidentes);
    router.get('/:id', incidenteController.getIncidenteById);
    router.post('/', userRequiredMiddleware,incidenteController.createIncidente);
    router.patch('/:id/edit',userRequiredMiddleware, incidenteController.updateIncidente);
    router.delete('/:id',userRequiredMiddleware, incidenteController.deleteIncidente);
    router.post('/:id/foto',userRequiredMiddleware, incidenteController.uploadPictureIncidente);

    app.use('/incidentes', router);
};
