import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavMenu = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);

    // Obtener información del usuario cuando se monta el componente
    useEffect(() => {
        if (token) {
            getUserInfo();
        }
    }, [token]);

    // Función para obtener la información del usuario desde el backend
    const getUserInfo = () => {
        axios.get('http://localhost:3000/auth/me', {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => {
            setUser(res.data); // Aquí se guarda el usuario con el rol
        }).catch(error => {
            console.error(error);
        });
    };

    // Función para cerrar sesión
    const onCerrarSesionClick = () => {
        axios.post('http://localhost:3000/auth/logout', {}, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(() => {
            localStorage.removeItem('token');
            navigate('/');
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">ABC</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {token && user && (
                            <>
                                {/* Mostrar solo si el usuario es administrador */}
                                {user.rol === 'administrador' && (
                                    <>
                                    <NavDropdown title="Usuarios" id="usuarios-dropdown">
                                        <Link className="dropdown-item" to={"/usuarios"}>Lista de Usuarios</Link>
                                        <Link className="dropdown-item" to="/usuarios/create">Crear Usuario</Link>
                                    </NavDropdown>

                                    <NavDropdown title="Datos" id="carreteras-dropdown">
                                        <Link className="dropdown-item" to={"/carreteras"}>Carreteras</Link>
                                        <Link className="dropdown-item" to={"/municipios"}>Municipios</Link>
                                        <Link className="dropdown-item" to={"/incidentes"}>Incidentes</Link>
                                        <Link className="dropdown-item" to={"/rutas"}>Rutas</Link>
                                    </NavDropdown>
                                    </>
                                )}

                                {/* Mostrar solo si el usuario es verificador */}
                                {user.rol === 'verificador' && (
                                    <NavDropdown title="Datos" id="carreteras-dropdown">
                                        <Link className="dropdown-item" to={"/carreteras"}>Carreteras</Link>
                                        <Link className="dropdown-item" to={"/municipios"}>Municipios</Link>
                                        <Link className="dropdown-item" to={"/incidentes"}>Incidentes</Link>
                                        <Link className="dropdown-item" to={"/rutas"}>Rutas</Link>
                                    </NavDropdown>
                                )}

                                <NavDropdown title={user.email} id="login-dropdown">
                                    <button className="dropdown-item" onClick={onCerrarSesionClick}>Cerrar sesión</button>
                                </NavDropdown>
                            </>
                        )}

                        {/* Si no hay token, mostrar las opciones de login y registro */}
                        {!token && (
                            <>
                                <Link className="nav-link" to="/login">Iniciar sesión</Link>
                                <Link className="nav-link" to="/register">Registro</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavMenu;
