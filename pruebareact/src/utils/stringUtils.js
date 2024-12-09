export const generoForDisplay = (genero) => {
    if (genero === 1) {
        return "Masculino";
    } else if (genero === 0) {
        return "Femenino";
    } else {
        return "Indefinido";
    }
}
export const tipoForDisplay = (tipo) => {
    if (tipo === 1) {
        return "Perro";
    } else if (tipo === 2) {
        return "Gato";
    } else if (tipo === 3) {
        return "Loro";
    } else if (tipo === 4) {
        return "Capibara";
    }
}