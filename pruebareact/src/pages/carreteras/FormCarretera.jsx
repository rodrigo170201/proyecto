// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { GoogleMap, Marker, useJsApiLoader, Polyline } from "@react-google-maps/api";
import axios from "axios";
import NavMenu from "../../components/NavMenu";

const FormCarretera = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [carretera, setCarretera] = useState({
    nombre: "",
    estado: "libre",
    razonBloqueo: "",
    puntos: [],
    municipioOrigenId: "",
    municipioDestinoId: "",
  });
  const [markerArray, setMarkerArray] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [validated, setValidated] = useState(false);
  const [mostrarRazonBloqueo, setMostrarRazonBloqueo] = useState(false); // Nuevo estado

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    fetchMunicipios();
    if (id) {
      getCarreteraById();
    }
  }, [id]);

  useEffect(() => {
    // Mostrar o ocultar el campo de razón del bloqueo según el estado
    setMostrarRazonBloqueo(carretera.estado === "bloqueada");
    if (carretera.estado !== "bloqueada") {
      setCarretera((prevState) => ({ ...prevState, razonBloqueo: "N/A" }));
    }
  }, [carretera.estado]);

  const fetchMunicipios = () => {
    axios
      .get("http://localhost:3000/municipios")
      .then((res) => {
        setMunicipios(res.data);
      })
      .catch((error) => {
        console.error("Error al cargar los municipios:", error);
        alert("No se pudieron cargar los municipios.");
      });
  };

  const getCarreteraById = () => {
    axios
      .get(`http://localhost:3000/carreteras/${id}`)
      .then((res) => {
        const data = res.data;
        let puntos = [];
        try {
          puntos = JSON.parse(data.puntos);
        } catch (error) {
          console.error("Error al parsear los puntos:", error);
        }
        if (Array.isArray(puntos)) {
          setCarretera({ ...data, puntos });
          setMarkerArray(puntos);
        } else {
          console.error("Los puntos no están en el formato esperado");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los datos de la carretera:", error);
        alert("No se pudieron cargar los datos de la carretera.");
      });
  };

  const handleMapClick = (event) => {
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    const updatedMarkers = [...markerArray, latLng];
    setMarkerArray(updatedMarkers);
    setCarretera({ ...carretera, puntos: updatedMarkers });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarretera({ ...carretera, [name]: value });
  };

  const onGuardarClick = (e) => {
    e.preventDefault();
    setValidated(true);

    if (
      !carretera.nombre ||
      !carretera.municipioOrigenId ||
      !carretera.municipioDestinoId ||
      markerArray.length < 2 ||
      (carretera.estado === "bloqueada" && !carretera.razonBloqueo)
    ) {
      alert(
        "Por favor, completa todos los campos requeridos y selecciona al menos dos puntos en el mapa."
      );
      return;
    }

    if (id) {
      editCarretera(carretera);
    } else {
      insertCarretera(carretera);
    }
  };

  const editCarretera = (data) => {
    const token = localStorage.getItem("token");

    axios
      .patch(`http://localhost:3000/carreteras/${id}/edit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Carretera actualizada exitosamente.");
        navigate("/carreteras");
      })
      .catch((error) => {
        console.error("Error al actualizar la carretera:", error);
        alert("Hubo un problema al actualizar la carretera.");
      });
  };

  const insertCarretera = (data) => {
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:3000/carreteras", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Carretera creada exitosamente.");
        navigate("/carreteras");
      })
      .catch((error) => {
        console.error("Error al guardar la carretera:", error);
        alert("Hubo un problema al guardar la carretera.");
      });
  };

  return (
    <>
      <NavMenu />
      <Container>
        <Row className="mt-3">
          <Col md={6}>
            <h3>{id ? "Actualizar Carretera" : "Crear Carretera"}</h3>
            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre de la Carretera</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre"
                  name="nombre"
                  value={carretera.nombre}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={carretera.estado}
                  onChange={handleInputChange}
                  required
                >
                  <option value="libre">Libre</option>
                  <option value="bloqueada">Bloqueada</option>
                </Form.Control>
              </Form.Group>
              {mostrarRazonBloqueo && (
                <Form.Group controlId="formRazonBloqueo">
                  <Form.Label>Razón del Bloqueo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la razón del bloqueo"
                    name="razonBloqueo"
                    value={carretera.razonBloqueo}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              )}
              <Form.Group controlId="formMunicipioOrigen">
                <Form.Label>Municipio Origen</Form.Label>
                <Form.Control
                  as="select"
                  name="municipioOrigenId"
                  value={carretera.municipioOrigenId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formMunicipioDestino">
                <Form.Label>Municipio Destino</Form.Label>
                <Form.Control
                  as="select"
                  name="municipioDestinoId"
                  value={carretera.municipioDestinoId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">
                Guardar
              </Button>
            </Form>
          </Col>
          <Col md={6}>
            <h4>Mapa</h4>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={{ lat: -17.7830258, lng: -63.1803598 }}
                zoom={9}
                onClick={handleMapClick}
              >
                {Array.isArray(markerArray) &&
                  markerArray.map((marker, index) => (
                    <Marker key={index} position={marker} title={`Punto ${index + 1}`} />
                  ))}
                {markerArray.length > 1 && (
                  <Polyline
                    path={markerArray}
                    options={{
                      strokeColor: "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div>Loading...</div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FormCarretera;
