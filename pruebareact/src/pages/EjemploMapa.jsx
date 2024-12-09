/* eslint-disable no-undef */
import { Col, Container, Row, Button, Modal, Form } from "react-bootstrap";
import NavMenu from "../components/NavMenu";
import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import axios from "axios";

const EjemploMapa = () => {
    const map = useMap();

    const [municipios, setMunicipios] = useState([]);
    const [carreteras, setCarreteras] = useState([]);
    const [selectedCarretera, setSelectedCarretera] = useState(null);
    const [selectedIncidencia, setSelectedIncidencia] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportDetails, setReportDetails] = useState({ photo: "", description: "" });
    const [incidentes, setIncidentes] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/municipios")
            .then(response => setMunicipios(response.data))
            .catch(error => console.error("Error al obtener los municipios:", error));

        axios.get("http://localhost:3000/carreteras")
            .then(response => setCarreteras(response.data))
            .catch(error => console.error("Error al obtener las carreteras:", error));

        axios.get("http://localhost:3000/incidentes")
            .then(response => {
                console.log("datos de incidentes:",response.data);
                setIncidentes(response.data);
            })
            .catch(error => console.error("Error al obtener los incidentes:", error));
    }, []);

    useEffect(() => {
        if (!map || !selectedCarretera) return;

        const { ruta, origen, destino } = selectedCarretera;

        if (ruta && ruta.length > 0) {
            const flightPath = new google.maps.Polyline({
                path: ruta,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            flightPath.setMap(map);

            if (origen && destino) {
                const origenMarker = new google.maps.Marker({
                    position: origen,
                    title: `Municipio de origen: ${origen.nombre}`,
                    map: map,
                });

                const destinoMarker = new google.maps.Marker({
                    position: destino,
                    title: `Municipio de destino: ${destino.nombre}`,
                    map: map,
                });

                return () => {
                    flightPath.setMap(null);
                    origenMarker.setMap(null);
                    destinoMarker.setMap(null);
                };
            }
        }
    }, [selectedCarretera, map]);

    const handleSelectCarretera = (carreteraId) => {
        axios.get(`http://localhost:3000/carreteras/${carreteraId}`)
            .then(response => {
                const carretera = response.data;
                const rutaConvertida = carretera.ruta.map(punto => ({
                    lat: punto.latitud,
                    lng: punto.longitud
                }));

                setSelectedCarretera({
                    ...carretera,
                    ruta: rutaConvertida,
                    origen: { lat: carretera.origen.latitud, lng: carretera.origen.longitud, nombre: carretera.origen.nombre },
                    destino: { lat: carretera.destino.latitud, lng: carretera.destino.longitud, nombre: carretera.destino.nombre },
                });
            })
            .catch(error => console.error("Error al obtener la carretera:", error));
    };

    const handleFilterIncidencias = (incidencia) => {
        setSelectedIncidencia(incidencia);
    };

    const handleReportIncident = () => {
        setShowReportModal(true);
    };

    const handleSubmitIncidentReport = () => {
        console.log("Reportando incidencia", reportDetails);
        setShowReportModal(false);
    };

    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-3 mb-3">
                    <Col md={12}>
                        <Map
                            mapId={"bf51a910020fa25a"}
                            style={{ width: "100%", height: "500px" }}
                            defaultCenter={{ lat: -17.78302580071355, lng: -63.180359841218795 }}
                            defaultZoom={10}
                            gestureHandling={"greedy"}
                            disableDefaultUI={true}
                        >
                            {municipios.map(municipio => (
                                <Marker
                                    key={municipio.id}
                                    position={{ lat: municipio.latitud, lng: municipio.longitud }}
                                    title={municipio.nombre}
                                />
                            ))}

                            {incidentes.map(incidente => (
                                <Marker
                                    key={incidente.id}
                                    position={{ lat: incidente.latitud, lng: incidente.longitud }}
                                    title={incidente.detalle}
                                    icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                />
                            ))}
                        </Map>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div>
                            <h3>Listado de Carreteras</h3>
                            {carreteras
                                .filter(carretera => {
                                    return selectedIncidencia ? carretera.incidencia === selectedIncidencia : true;
                                })
                                .map(carretera => (
                                    <div key={carretera.id}>
                                        <h5>{carretera.nombre}</h5>
                                        <Button onClick={() => handleSelectCarretera(carretera.id)}>
                                            Ver Carretera
                                        </Button>
                                        {carretera.estado === "bloqueada" && (
                                            <Button onClick={() => alert(carretera.razonBloqueo)}>
                                                Ver Motivo
                                            </Button>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={12}>
                        <h4>Filtrar Carreteras por Incidencia</h4>
                        <Button onClick={() => handleFilterIncidencias("")}>Todas</Button>
                        <Button onClick={() => handleFilterIncidencias("transitable")}>Transitable</Button>
                        <Button onClick={() => handleFilterIncidencias("no_transitable")}>No Transitable</Button>
                        <Button onClick={() => handleFilterIncidencias("bloqueada")}>Bloqueada</Button>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={12}>
                        <Button onClick={handleReportIncident}>Reportar Incidente</Button>
                    </Col>
                </Row>
            </Container>

            <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reportar Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="incidentDescription">
                            <Form.Label>Descripción del Incidente</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reportDetails.description}
                                onChange={e => setReportDetails({ ...reportDetails, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="incidentPhoto">
                            <Form.Label>Foto del Incidente</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={e => setReportDetails({ ...reportDetails, photo: e.target.files[0] })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReportModal(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={handleSubmitIncidentReport}>Enviar Reporte</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EjemploMapa;
