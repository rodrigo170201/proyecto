const db = require("../models");
const sha1 = require('sha1');


exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await db.usuarios.findAll();
        res.json(usuarios);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await db.usuarios.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.createUsuario = async (req, res) => {
    const { email, password, rol } = req.body;

    const camposFaltantes = [];
    if (!email) camposFaltantes.push("email");
    if (!password) camposFaltantes.push("password");
    if (!rol) camposFaltantes.push("rol");

    if (camposFaltantes.length > 0) {
        return res.status(400).json({
            msg: "Faltan campos requeridos",
            camposFaltantes
        });
    }

    try {
        const usuarioExistente = await db.usuarios.findOne({
            where: {
                email: email
            }
        });

        if (usuarioExistente) {
            return res.status(400).json({ msg: "El email ya está registrado" });
        }

        const passwordEncriptada = sha1(password);

        const nuevoUsuario = await db.usuarios.create({
            email,
            password: passwordEncriptada,
            rol,
        });

        res.status(201).json({
            msg: "Usuario creado correctamente",
            usuario: {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await db.usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const { email, password, rol } = req.body;
        usuario.email = email || usuario.email;
        usuario.password = password ? sha1(password) : usuario.password; // Encriptar contraseña si se proporciona
        usuario.rol = rol || usuario.rol;

        await usuario.save();
        res.json({ msg: "Usuario actualizado correctamente" });
    } catch (error) {
        sendError500(error, res);
    }
};


exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await db.usuarios.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        await usuario.destroy();
        res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        sendError500(error, res);
    }
};

function sendError500(error, res) {
    res.status(500).json({ error: error.message });
}
