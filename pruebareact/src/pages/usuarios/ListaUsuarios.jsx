import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ListaUsuarios = () => {
    useAuth();

    const [ListaUsuarios, setListaUsuarios] = useState([]);

    useEffect(() => {
        getListaUsuarios();
        document.title = "Lista de Usuarios";
    }, []);

    const getListaUsuarios = () => {
        axios.get('http://localhost:3000/usuarios')
            .then(res => {
                setListaUsuarios(res.data);
                // console.log(res.data);
            }).catch(error => {
                console.log(error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        const token = localStorage.getItem("token");
        axios.delete(`http://localhost:3000/usuarios/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
            .then(res => {
                console.log(res.data);
                getListaUsuarios();
            }).catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de Usuarios</h2>
                                </Card.Title>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ListaUsuarios.map(usuario =>
                                            <tr key={usuario.id}>
                                                <td>{usuario.id}</td>
                                                <td>{usuario.email}</td>
                                                <td>{usuario.rol}</td>
                                                <td>
                                                    <Link
                                                        className="btn btn-primary"
                                                        to={`/usuarios/${usuario.id}`}
                                                    >
                                                        Editar
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => eliminar(usuario.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaUsuarios;
