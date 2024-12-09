const db = require("../models");
const { Op } = require("sequelize");


exports.listIncidentes = async (req, res) => {
    try {
        const incidentes = await db.Incidente.findAll({
            include: [
                { model: db.Ruta, as: "ruta" },
                { model: db.usuarios, as: "creador" },
            ],
        });
        res.json(incidentes);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.getIncidenteById = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await db.Incidente.findByPk(id, {
            include: [
                { model: db.Ruta, as: "ruta" },
                { model: db.usuarios, as: "creador" },
            ],
        });

        if (!incidente) {
            return res.status(404).json({ msg: "Incidente no encontrado" });
        }
        res.json(incidente);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.createIncidente = async (req, res) => {
    const { tipo, detalle, latitud, longitud, rutaId } = req.body;

    if (!tipo || !detalle || !latitud || !longitud || !rutaId) {
        return res.status(400).json({ msg: "Faltan campos requeridos" });
    }

    try {
        const nuevoIncidente = await db.Incidente.create({
            tipo,
            detalle,
            latitud,
            longitud,
            rutaId,
            creadorId: req.user.id,
        });

        res.status(201).json({ id: nuevoIncidente.id, msg: "Incidente creado correctamente" });
    } catch (error) {
        sendError500(error, res);
    }
};


exports.updateIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) return;

        const { tipo, detalle, latitud, longitud, rutaId } = req.body;
        incidente.tipo = tipo || incidente.tipo;
        incidente.detalle = detalle || incidente.detalle;
        incidente.latitud = latitud || incidente.latitud;
        incidente.longitud = longitud || incidente.longitud;
        incidente.rutaId = rutaId || incidente.rutaId;

        await incidente.save();
        res.json({ msg: "Incidente actualizado correctamente" });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.deleteIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) return;

        await incidente.destroy();
        res.json({ msg: "Incidente eliminado correctamente" });
    } catch (error) {
        sendError500(error, res);
    }
};


exports.uploadPictureIncidente = async (req, res) => {
    const id = req.params.id;

    try {
        const incidente = await db.Incidente.findByPk(id);
        if (!incidente) {
            res.status(404).json({ msg: "Incidente no encontrado" });
            return;
        }

        if (!req.files) {
            res.status(400).json({ msg: "No se ha enviado el archivo" });
            return;
        }

        const file = req.files.fotoIncidente;
        const fileName = incidente.id + '.jpg';
        file.mv(`public/incidentes/${fileName}`);

        incidente.foto = `/incidentes/${fileName}`;
        await incidente.save();

        res.json(incidente);
    } catch (error) {
        res.status(500).json({ msg: "Error interno del servidor", details: error.message });
    }
};
;

// Utilidades auxiliares
async function getIncidenteOr404(id, res) {
    const incidente = await db.Incidente.findByPk(id);
    if (!incidente) {
        res.status(404).json({ msg: "Incidente no encontrado" });
        return null;
    }
    return incidente;
}

function sendError500(error, res) {
    if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(400).json({ error: "Validation error", details: validationErrors });
    }
    res.status(500).json({ error: error.message });
}
