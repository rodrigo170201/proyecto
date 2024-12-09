module.exports = (sequelize, Sequelize) => {
    const Ruta = sequelize.define("ruta", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        estado: {
            type: Sequelize.ENUM("bloqueada", "libre"),
            allowNull: false,
        },
        razonBloqueo: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });

    Ruta.associate = (models) => {
        Ruta.belongsTo(models.Municipio, {
            as: "origen",
            foreignKey: "origenMunicipioId",
        });
        Ruta.belongsTo(models.Municipio, {
            as: "destino",
            foreignKey: "destinoMunicipioId",
        });
        Ruta.belongsTo(models.Carretera, {
            as: "carretera",
            foreignKey: "carreteraId",
        });
        Ruta.hasMany(models.Incidente, {
            as: "incidentes",
            foreignKey: "rutaId",
        });
    };

    return Ruta;
};
