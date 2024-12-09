// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import NavMenu from "../../components/NavMenu";

const FormIncidente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incidente, setIncidente] = useState({
    tipo: "",
    detalle: "",
    latitud: null,
    longitud: null,
    rutaId: "", // Nueva propiedad para la ruta seleccionada
  });
  const [rutas, setRutas] = useState([]); // Estado para almacenar las rutas
  const [markerPosition, setMarkerPosition] = useState(null);
  const [validated, setValidated] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (id) {
      getIncidenteById();
    }
    getRutas(); // Obtener rutas al cargar el componente
  }, [id]);

  const getIncidenteById = () => {
    axios
      .get(`http://localhost:3000/incidentes/${id}`)
      .then((res) => {
        const data = res.data;
        setIncidente(data);
        setMarkerPosition({
          lat: parseFloat(data.latitud),
          lng: parseFloat(data.longitud),
        });
      })
      .catch((error) => {
        console.error("Error al cargar los datos del incidente:", error);
        alert("No se pudieron cargar los datos del incidente.");
      });
  };

  const getRutas = () => {
    axios
      .get("http://localhost:3000/rutas") // Endpoint para obtener las rutas
      .then((res) => {
        setRutas(res.data); // Guardar las rutas en el estado
      })
      .catch((error) => {
        console.error("Error al cargar las rutas:", error);
        alert("No se pudieron cargar las rutas.");
      });
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setIncidente({ ...incidente, latitud: lat, longitud: lng });
  };

  const handleInputChange = (e) => {
    setIncidente({ ...incidente, [e.target.name]: e.target.value });
  };

  const onGuardarClick = (e) => {
    e.preventDefault();
    setValidated(true);

    if (!incidente.tipo || !incidente.detalle || !incidente.latitud || !incidente.longitud || !incidente.rutaId) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (id) {
      editIncidente(incidente);
    } else {
      insertIncidente(incidente);
    }
  };

  const editIncidente = (data) => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage
  

    axios
      .patch(`http://localhost:3000/incidentes/${id}/edit`, data,{
        headers:{
            Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Incidente actualizado:", res.data);
        navigate("/incidentes");
      })
      .catch((error) => {
        console.error("Error al actualizar el incidente:", error);
        alert("Hubo un problema al actualizar el incidente.");
      });
  };

  const insertIncidente = (data) => {
    const token = localStorage.getItem("token"); // Obtiene el token del localStorage
  
    axios
      .post("http://localhost:3000/incidentes", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token al encabezado de autorización
        },
      })
      .then((res) => {
        console.log("Incidente creado:", res.data);
        navigate("/incidentes");
      })
      .catch((error) => {
        console.error("Error al guardar el incidente:", error);
        alert("Hubo un problema al guardar el incidente.");
      });
  };
  

  return (
    <>
      <NavMenu />
      <Container>
        <Row className="mt-3">
          <Col md={6}>
            <h3>{id ? "Actualizar Incidente" : "Crear Incidente"}</h3>
            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
              <Form.Group controlId="formRuta">
                <Form.Label>Ruta</Form.Label>
                <Form.Control
                  as="select"
                  name="rutaId"
                  value={incidente.rutaId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona una ruta</option>
                  {rutas.map((ruta) => (
                    <option key={ruta.id} value={ruta.id}>
                      {ruta.nombre}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Por favor selecciona una ruta.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formTipo">
                <Form.Label>Tipo de Incidente</Form.Label>
                <Form.Control
                  as="select"
                  name="tipo"
                  value={incidente.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Transitable con desvíos y/o horarios de circulación">
                    Transitable con desvíos y/o horarios de circulación
                  </option>
                  <option value="No transitable por conflictos sociales">
                    No transitable por conflictos sociales
                  </option>
                  <option value="Restricción vehicular">
                    Restricción vehicular
                  </option>
                  <option value="No transitable tráfico cerrado">
                    No transitable tráfico cerrado
                  </option>
                  <option value="Restricción vehicular, especial">
                    Restricción vehicular, especial
                  </option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Por favor selecciona un tipo de incidente.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDetalle">
                <Form.Label>Detalle del Incidente</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="detalle"
                  value={incidente.detalle}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingresa un detalle válido.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Latitud</Form.Label>
                <Form.Control
                  type="text"
                  value={incidente.latitud || ""}
                  readOnly
                  placeholder="Selecciona una ubicación en el mapa"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Longitud</Form.Label>
                <Form.Control
                  type="text"
                  value={incidente.longitud || ""}
                  readOnly
                  placeholder="Selecciona una ubicación en el mapa"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                {id ? "Actualizar" : "Guardar"}
              </Button>
            </Form>
          </Col>
          <Col md={6}>
            <h4>Mapa</h4>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={markerPosition || { lat: -17.7830258, lng: -63.1803598 }}
                zoom={10}
                onClick={handleMapClick}
              >
                {markerPosition && (
                  <Marker
                    position={markerPosition}
                    title="Ubicación seleccionada"
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
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

export default FormIncidente;
