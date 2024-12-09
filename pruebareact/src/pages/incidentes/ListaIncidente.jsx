import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Form, FormControl } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import 'leaflet/dist/leaflet.css';

const ListaIncidentes = () => {
    const [listaIncidentes, setListaIncidentes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getListaIncidentes();
        document.title = "Administración | Incidentes";
    }, []);

    const getListaIncidentes = () => {
        axios.get("http://localhost:3000/incidentes")
            .then(res => {
                setListaIncidentes(res.data);
            })
            .catch(error => {
                console.error("Error al obtener los incidentes:", error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el incidente?");
        if (!confirm) {
            return;
        }
        const token = localStorage.getItem("token");
        
        axios.delete(`http://localhost:3000/incidentes/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
            .then(() => {
                getListaIncidentes(); // Refresca la lista tras eliminar
            })
            .catch(error => {
                console.error("Error al eliminar el incidente:", error);
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
                                    <h2>Catálogo de Incidentes</h2>
                                    <Link className="btn btn-primary" to="/incidentes/create">+</Link>
                                </Card.Title>
                                <Form className="d-flex mb-3">
                                    <FormControl
                                        type="search"
                                        placeholder="Buscar Incidente"
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
                                            <th>Foto</th>
                                            <th>ID</th>
                                            <th>Tipo</th>
                                            <th>Detalle</th>
                                            <th>Ubicación</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaIncidentes
                                            .filter(incidente =>
                                                incidente.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                incidente.detalle.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map(incidente => (
                                                <tr key={incidente.id}>
                                                    <td>
                                                        <img 
                                                            src={`http://localhost:3000/incidentes/${incidente.id}.jpg`} 
                                                            alt={`Foto del incidente ${incidente.id}`} 
                                                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10%" }} 
                                                        />

                                                    </td>
                                                    <td>{incidente.id}</td>
                                                    <td>{incidente.tipo}</td>
                                                    <td>{incidente.detalle}</td>
                                                    <td>
                                                        <div style={{ height: '100px', width: '150px' }}>
                                                            <MapContainer
                                                                center={[incidente.latitud, incidente.longitud]}
                                                                zoom={13}
                                                                scrollWheelZoom={false}
                                                                style={{ height: '100%', width: '100%' }}
                                                            >
                                                                <TileLayer
                                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                />
                                                                <Marker 
                                                                    position={[incidente.latitud, incidente.longitud]}
                                                                    icon={new Icon({ iconUrl: '/path/to/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}
                                                                >
                                                                    <Popup>
                                                                        <strong>Ubicación</strong><br />
                                                                        Latitud: {incidente.latitud}<br />
                                                                        Longitud: {incidente.longitud}
                                                                    </Popup>
                                                                </Marker>
                                                            </MapContainer>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-around">
                                                            <Link className="btn btn-primary btn-sm" to={`/incidentes/${incidente.id}`}>Editar</Link>
                                                            <Link className="btn btn-success btn-sm" to={`/incidentes/${incidente.id}/foto`}>Subir Foto</Link>
                                                            <Button variant="danger" size="sm" onClick={() => eliminar(incidente.id)}>Eliminar</Button>
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

export default ListaIncidentes;
