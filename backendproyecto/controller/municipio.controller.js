const db = require("../models");
const Municipio = db.Municipio;


exports.listMunicipios = async (req, res) => {
    try {
        const municipios = await Municipio.findAll();
        res.json(municipios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMunicipioById = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await Municipio.findByPk(id);
        if (!municipio) {
            return res.status(404).json({ msg: "Municipio no encontrado" });
        }
        res.json(municipio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMunicipio = async (req, res) => {
    const { nombre, latitud, longitud } = req.body;

    const camposFaltantes = [];
    if (!nombre) camposFaltantes.push("nombre");
    if (!latitud) camposFaltantes.push("latitud");
    if (!longitud) camposFaltantes.push("longitud");

    if (camposFaltantes.length > 0) {
        return res.status(400).json({ 
            msg: "Faltan campos requeridos", 
            camposFaltantes 
        });
    }

    try {
        const nuevoMunicipio = await Municipio.create({ nombre, latitud, longitud });
        res.status(201).json({
            msg: "Municipio creado correctamente",
            municipio: nuevoMunicipio,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateMunicipio = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await Municipio.findByPk(id);
        if (!municipio) {
            return res.status(404).json({ msg: "Municipio no encontrado" });
        }

        const { nombre, latitud, longitud } = req.body;
        municipio.nombre = nombre || municipio.nombre;
        municipio.latitud = latitud || municipio.latitud;
        municipio.longitud = longitud || municipio.longitud;

        await municipio.save();
        res.json({ msg: "Municipio actualizado correctamente", municipio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteMunicipio = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await Municipio.findByPk(id);
        if (!municipio) {
            return res.status(404).json({ msg: "Municipio no encontrado" });
        }

        await municipio.destroy();
        res.json({ msg: "Municipio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
