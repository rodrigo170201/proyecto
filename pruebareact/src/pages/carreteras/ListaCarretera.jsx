import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Form, FormControl } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { Link } from "react-router-dom";

const ListaCarretera = () => {
    const [listaCarreteras, setListaCarreteras] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getListaCarreteras();
        document.title = "Administración | Carreteras";
    }, []);

    const getListaCarreteras = () => {
        axios.get("http://localhost:3000/carreteras")
            .then(res => {
                setListaCarreteras(res.data);
            })
            .catch(error => {
                console.error("Error al obtener las carreteras:", error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar la carretera?");
        if (!confirm) {
            return;
        }
        
        const token = localStorage.getItem("token");
        axios.delete(`http://localhost:3000/carreteras/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
            .then(() => {
                getListaCarreteras();
            })
            .catch(error => {
                console.error("Error al eliminar la carretera:", error);
            });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="d-flex justify-content-between align-items-center">
                                    <h2>Catálogo de Carreteras</h2>
                                    <Link className="btn btn-primary" to="/carreteras/create">+</Link> {/* Botón para añadir carretera */}
                                </Card.Title>
                                <Form className="d-flex mb-3">
                                    <FormControl
                                        type="search"
                                        placeholder="Buscar Carretera"
                                        className="me-2"
                                        aria-label="Buscar"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    <Button variant="outline-success">Buscar</Button>
                                </Form>
                                <Table striped bordered hover responsive className="mt-3">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Estado</th>
                                            <th>Razón de Bloqueo</th>
                                            <th>Municipio Origen</th>
                                            <th>Municipio Destino</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaCarreteras
                                            .filter(carretera =>
                                                carretera.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map(carretera => (
                                                <tr key={carretera.id}>
                                                    <td>{carretera.id}</td>
                                                    <td>{carretera.nombre}</td>
                                                    <td>{carretera.estado}</td>
                                                    <td>{carretera.razonBloqueo || "N/A"}</td>
                                                    <td>{carretera.origen?.nombre || "N/A"}</td>
                                                    <td>{carretera.destino?.nombre || "N/A"}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-around">
                                                            <Link className="btn btn-primary btn-sm" to={`/carreteras/${carretera.id}`}>Editar</Link>
                                                            <Button variant="danger" size="sm" onClick={() => eliminar(carretera.id)}>Eliminar</Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
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

export default ListaCarretera;
