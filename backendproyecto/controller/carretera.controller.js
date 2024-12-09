const db = require("../models");
const Carretera = db.Carretera;
const Municipio = db.Municipio;


exports.listCarreteras = async (req, res) => {
    try {
        const carreteras = await Carretera.findAll({
            include: [
                { model: Municipio, as: "origen", attributes: ["id", "nombre"] },
                { model: Municipio, as: "destino", attributes: ["id", "nombre"] },
            ],
        });
        res.json(carreteras);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.getCarreteraById = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await Carretera.findByPk(id, {
            include: [
                { model: Municipio, as: "origen", attributes: ["id", "nombre"] },
                { model: Municipio, as: "destino", attributes: ["id", "nombre"] },
            ],
        });
        if (!carretera) {
            return res.status(404).json({ msg: "Carretera no encontrada" });
        }
        res.json(carretera);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.createCarretera = async (req, res) => {
    const { nombre, estado, razonBloqueo, puntos, municipioOrigenId, municipioDestinoId } = req.body;


    const camposFaltantes = [];
    if (!nombre) camposFaltantes.push("nombre");
    if (!estado) camposFaltantes.push("estado");
    if (!puntos) camposFaltantes.push("puntos");
    if (!municipioOrigenId) camposFaltantes.push("municipioOrigenId");
    if (!municipioDestinoId) camposFaltantes.push("municipioDestinoId");

    if (camposFaltantes.length > 0) {
        return res.status(400).json({
            msg: "Faltan campos requeridos",
            camposFaltantes,
        });
    }

    try {
        const nuevaCarretera = await Carretera.create({
            nombre,
            estado,
            razonBloqueo,
            puntos,
            municipioOrigenId,
            municipioDestinoId,
        });

        res.status(201).json({
            msg: "Carretera creada correctamente",
            carretera: nuevaCarretera,
        });
    } catch (error) {
        sendError500(error, res);
    }
};


exports.updateCarretera = async (req, res) => {
    const id = req.params.id;
    const { nombre, estado, razonBloqueo, puntos, municipioOrigenId, municipioDestinoId } = req.body;

    try {
        const carretera = await Carretera.findByPk(id);
        if (!carretera) {
            return res.status(404).json({ msg: "Carretera no encontrada" });
        }

        // Actualizar los campos
        carretera.nombre = nombre || carretera.nombre;
        carretera.estado = estado || carretera.estado;
        carretera.razonBloqueo = razonBloqueo || carretera.razonBloqueo;
        carretera.puntos = puntos || carretera.puntos;
        carretera.municipioOrigenId = municipioOrigenId || carretera.municipioOrigenId;
        carretera.municipioDestinoId = municipioDestinoId || carretera.municipioDestinoId;

        await carretera.save();
        res.json({ msg: "Carretera actualizada correctamente", carretera });
    } catch (error) {
        sendError500(error, res);
    }
};


exports.deleteCarretera = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await Carretera.findByPk(id);
        if (!carretera) {
            return res.status(404).json({ msg: "Carretera no encontrada" });
        }

        await carretera.destroy();
        res.json({ msg: "Carretera eliminada correctamente" });
    } catch (error) {
        sendError500(error, res);
    }
};



function sendError500(error, res) {
    res.status(500).json({ error: error.message });
}
