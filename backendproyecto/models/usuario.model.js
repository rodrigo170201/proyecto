module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        rol: {
            type: Sequelize.ENUM('administrador', 'verificador'),
            allowNull: false,
        },
    });

    return Usuario;
};
