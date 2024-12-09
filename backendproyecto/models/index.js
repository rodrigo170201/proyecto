const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.Municipio = require("./municipio.model.js")(sequelize, Sequelize);
db.Carretera = require("./carretera.model.js")(sequelize, Sequelize);
db.Ruta = require("./ruta.model.js")(sequelize, Sequelize);
db.Incidente = require("./incidente.model.js")(sequelize, Sequelize);
db.tokens = require("./auth_token.model.js")(sequelize, Sequelize);



db.usuarios.hasMany(db.tokens, { as: "tokens" });
db.tokens.belongsTo(db.usuarios, {
    foreignKey: "usuarioId",
    as: "usuario",
});


db.Ruta.belongsTo(db.Municipio, { as: "origen", foreignKey: "origenMunicipioId" });
db.Ruta.belongsTo(db.Municipio, { as: "destino", foreignKey: "destinoMunicipioId" });


db.Ruta.belongsTo(db.Carretera, { as: "carretera", foreignKey: "carreteraId" });



db.Ruta.hasMany(db.Incidente, {
    as: "incidentes",
    foreignKey: "rutaId",
});
db.Incidente.belongsTo(db.Ruta, {
    as: "ruta",
    foreignKey: "rutaId",
});


db.usuarios.hasMany(db.Incidente, {
    as: "incidentesCreados",
    foreignKey: "creadorId",
});
db.Incidente.belongsTo(db.usuarios, {
    as: "creador",
    foreignKey: "creadorId",
});


db.Carretera.belongsTo(db.Municipio, { as: "origen", foreignKey: "municipioOrigenId" });
db.Carretera.belongsTo(db.Municipio, { as: "destino", foreignKey: "municipioDestinoId" });
db.Municipio.hasMany(db.Carretera, { as: "carreterasOrigen", foreignKey: "municipioOrigenId" });
db.Municipio.hasMany(db.Carretera, { as: "carreterasDestino", foreignKey: "municipioDestinoId" });


module.exports = db;
