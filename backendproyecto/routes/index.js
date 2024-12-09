module.exports = (app) => {
    require('./incidente.routes')(app);
    require('./ruta.routes')(app);
    require('./usuario.routes')(app);
    require("./auth.routes")(app);
    require("./carretera.routes")(app);
    require("./municipio.routes")(app);
};
