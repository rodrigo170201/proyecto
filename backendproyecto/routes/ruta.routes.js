const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware");

module.exports = (app) => {
    const router = require("express").Router();
    const rutaController = require("../controller/ruta.controller");

    router.get("/", rutaController.listRutas);
    router.get("/:id", rutaController.getRutaById);
    router.post("/",userRequiredMiddleware, rutaController.createRuta);
    router.patch("/:id/edit",userRequiredMiddleware, rutaController.updateRuta);
    router.delete("/:id",userRequiredMiddleware, rutaController.deleteRuta);

    app.use("/rutas", router);
};
