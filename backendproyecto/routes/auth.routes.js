const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware.js");

module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controller/auth.controller.js");

    router.post('/login', controller.login);
    router.post('/logout', controller.logout);
    router.get('/me', userRequiredMiddleware, controller.me);

    app.use('/auth', router);

};