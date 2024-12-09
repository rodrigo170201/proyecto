module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        estado: {
            type: Sequelize.ENUM("libre", "bloqueada"),
            allowNull: false,
        },
        razonBloqueo: {
            type: Sequelize.STRING,
        },
        puntos: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        municipioOrigenId: {
            type: Sequelize.INTEGER,
            references: {
                model: "Municipio",
                key: "id",
            },
            allowNull: false,
        },
        municipioDestinoId: {
            type: Sequelize.INTEGER,
            references: {
                model: "Municipio",
                key: "id",
            },
            allowNull: false,
        },
    });

    return Carretera;
};
