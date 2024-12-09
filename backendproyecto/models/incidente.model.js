module.exports = (sequelize, Sequelize) => {
    const Incidente = sequelize.define("incidente", {
        tipo: {
            type: Sequelize.ENUM(
                'Transitable con desvíos y/o horarios de circulación',
                'No transitable por conflictos sociales',
                'Restricción vehicular',
                'No transitable tráfico cerrado',
                'Restricción vehicular, especial'
            ),
            allowNull: false,
        },
        detalle: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        latitud: {
            type: Sequelize.DECIMAL(10, 8),
            allowNull: false,
        },
        longitud: {
            type: Sequelize.DECIMAL(11, 8),
            allowNull: false,
        },
    });

    return Incidente;
};
