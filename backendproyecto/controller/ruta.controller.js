const db = require("../models");
const Ruta = db.Ruta;
const Municipio = db.Municipio;
const Carretera = db.Carretera;


exports.createRuta = async (req, res) => {
    try {
        const { nombre, estado, razonBloqueo, origenMunicipioId, destinoMunicipioId, carreteraId } = req.body;

        const ruta = await Ruta.create({
            nombre,
            estado,
            razonBloqueo,
            origenMunicipioId,
            destinoMunicipioId,
            carreteraId,
        });

        res.status(201).json(ruta);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la ruta", error: error.message });
    }
};


exports.listRutas = async (req, res) => {
    try {
        const rutas = await Ruta.findAll({
            include: [
                { model: Municipio, as: "origen" },
                { model: Municipio, as: "destino" },
                { model: Carretera, as: "carretera" },
            ],
        });

        res.status(200).json(rutas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las rutas", error: error.message });
    }
};


exports.getRutaById = async (req, res) => {
    try {
        const ruta = await Ruta.findByPk(req.params.id, {
            include: [
                { model: Municipio, as: "origen" },
                { model: Municipio, as: "destino" },
                { model: Carretera, as: "carretera" },
            ],
        });

        if (!ruta) {
            return res.status(404).json({ message: "Ruta no encontrada" });
        }

        res.status(200).json(ruta);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la ruta", error: error.message });
    }
};


exports.updateRuta = async (req, res) => {
    try {
        const { nombre, estado, razonBloqueo, origenMunicipioId, destinoMunicipioId, carreteraId } = req.body;

        const [updated] = await Ruta.update(
            { nombre, estado, razonBloqueo, origenMunicipioId, destinoMunicipioId, carreteraId },
            { where: { id: req.params.id } }
        );

        if (!updated) {
            return res.status(404).json({ message: "Ruta no encontrada para actualizar" });
        }

        res.status(200).json({ message: "Ruta actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la ruta", error: error.message });
    }
};


exports.deleteRuta = async (req, res) => {
    try {
        const deleted = await Ruta.destroy({ where: { id: req.params.id } });

        if (!deleted) {
            return res.status(404).json({ message: "Ruta no encontrada para eliminar" });
        }

        res.status(200).json({ message: "Ruta eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la ruta", error: error.message });
    }
};
