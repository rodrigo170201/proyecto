import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Form, FormControl } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { Link } from "react-router-dom";

const ListaMunicipios = () => {
    const [listaMunicipios, setListaMunicipios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getListaMunicipios();
        document.title = "Administración | Municipios";
    }, []);

    const getListaMunicipios = () => {
        axios.get("http://localhost:3000/municipios")
            .then(res => {
                setListaMunicipios(res.data);
            })
            .catch(error => {
                console.error("Error al obtener los municipios:", error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el municipio?");
        if (!confirm) {
            return;
        }
        const token = localStorage.getItem("token");
        axios.delete(`http://localhost:3000/municipios/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
            .then(() => {
                getListaMunicipios();
            })
            .catch(error => {
                console.error("Error al eliminar el municipio:", error);
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
                                    <h2>Catálogo de Municipios</h2>
                                    <Link className="btn btn-primary" to="/municipios/create">+</Link> {/* Botón para añadir municipio */}
                                </Card.Title>
                                <Form className="d-flex mb-3">
                                    <FormControl
                                        type="search"
                                        placeholder="Buscar Municipio"
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
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaMunicipios
                                            .filter(municipio =>
                                                municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map(municipio => (
                                                <tr key={municipio.id}>
                                                    <td>{municipio.id}</td>
                                                    <td>{municipio.nombre}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-around">
                                                            <Link className="btn btn-primary btn-sm" to={`/municipios/${municipio.id}`}>Editar</Link>
                                                            <Button variant="danger" size="sm" onClick={() => eliminar(municipio.id)}>Eliminar</Button>
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

export default ListaMunicipios;
