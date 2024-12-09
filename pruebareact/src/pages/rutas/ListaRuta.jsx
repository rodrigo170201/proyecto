import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Form, FormControl } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ListaRuta = () => {
    const [listaRutas, setListaRutas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRuta, setSelectedRuta] = useState(null);

    useEffect(() => {
        getListaRutas();
        document.title = "Administración | Rutas";
    }, []);

    const getListaRutas = () => {
        axios.get("http://localhost:3000/rutas")
            .then(res => {
                setListaRutas(res.data);
            })
            .catch(error => {
                console.error("Error al obtener las rutas:", error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar la ruta?");
        if (!confirm) {
            return;
        }

        const token = localStorage.getItem("token");
        axios.delete(`http://localhost:3000/rutas/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                getListaRutas();
            })
            .catch(error => {
                console.error("Error al eliminar la ruta:", error);
            });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRutaClick = (ruta) => {
        setSelectedRuta(ruta);
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col md={8}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="d-flex justify-content-between align-items-center">
                                    <h2>Catálogo de Rutas</h2>
                                    <Link className="btn btn-primary" to="/rutas/create">+</Link>
                                </Card.Title>
                                <Form className="d-flex mb-3">
                                    <FormControl
                                        type="search"
                                        placeholder="Buscar Ruta"
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
                                            <th>Origen</th>
                                            <th>Destino</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaRutas
                                            .filter(ruta =>
                                                ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map(ruta => (
                                                <tr key={ruta.id}>
                                                    <td>{ruta.id}</td>
                                                    <td>{ruta.nombre}</td>
                                                    <td>{ruta.estado}</td>
                                                    <td>{ruta.razonBloqueo || "N/A"}</td>
                                                    <td>{ruta.origen?.nombre || "N/A"}</td>
                                                    <td>{ruta.destino?.nombre || "N/A"}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-around">
                                                            <Button
                                                                variant="info"
                                                                size="sm"
                                                                onClick={() => handleRutaClick(ruta)}
                                                            >
                                                                Ver en Mapa
                                                            </Button>
                                                            <Link className="btn btn-primary btn-sm" to={`/rutas/${ruta.id}`}>Editar</Link>
                                                            <Button variant="danger" size="sm" onClick={() => eliminar(ruta.id)}>Eliminar</Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Mapa de la Ruta</Card.Title>
                                <div style={{ height: "400px" }}>
                                    <MapContainer
                                        center={selectedRuta ? [selectedRuta.origen.latitud, selectedRuta.origen.longitud] : [-17.7838, -63.1817]}
                                        zoom={10}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {selectedRuta && (
                                            <>
                                                {/* Dibujar puntos de origen y destino */}
                                                <Marker position={[selectedRuta.origen.latitud, selectedRuta.origen.longitud]}>
                                                    <Popup>{selectedRuta.origen.nombre}</Popup>
                                                </Marker>
                                                <Marker position={[selectedRuta.destino.latitud, selectedRuta.destino.longitud]}>
                                                    <Popup>{selectedRuta.destino.nombre}</Popup>
                                                </Marker>

                                                {/* Dibujar la carretera */}
                                                <Polyline
                                                    positions={JSON.parse(selectedRuta.carretera.puntos).map(p => [p.lat, p.lng])}
                                                    color="blue"
                                                />
                                            </>
                                        )}
                                    </MapContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaRuta;
