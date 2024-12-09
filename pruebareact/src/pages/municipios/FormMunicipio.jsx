// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import NavMenu from "../../components/NavMenu";

const FormMunicipio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [municipio, setMunicipio] = useState({
    nombre: "",
    latitud: null,
    longitud: null,
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [validated, setValidated] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Usando la clave de la variable de entorno
  });

  useEffect(() => {
    if (id) {
      getMunicipioById();
    }
  }, [id]);

  const getMunicipioById = () => {
    axios
      .get(`http://localhost:3000/municipios/${id}`)
      .then((res) => {
        const data = res.data;
        setMunicipio(data);
        setMarkerPosition({
          lat: parseFloat(data.latitud),
          lng: parseFloat(data.longitud),
        });
      })
      .catch((error) => {
        console.error("Error al cargar los datos del municipio:", error);
        alert("No se pudieron cargar los datos del municipio.");
      });
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setMunicipio({ ...municipio, latitud: lat, longitud: lng });
  };

  const handleInputChange = (e) => {
    setMunicipio({ ...municipio, [e.target.name]: e.target.value });
  };

  const onGuardarClick = (e) => {
    e.preventDefault();
    setValidated(true);

    if (!municipio.nombre || !municipio.latitud || !municipio.longitud) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (id) {
      editMunicipio(municipio);
    } else {
      insertMunicipio(municipio);
    }
  };

  const editMunicipio = (data) => {
    const token = localStorage.getItem("token");

    axios
      .patch(`http://localhost:3000/municipios/${id}/edit`, data,{
        headers:{
            Authorization:`Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Municipio actualizado:", res.data);
        navigate("/municipios");
      })
      .catch((error) => {
        console.error("Error al actualizar el municipio:", error);
        alert("Hubo un problema al actualizar el municipio.");
      });
  };

  const insertMunicipio = (data) => {
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:3000/municipios", data,{
        headers:{
            Authorization:`Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Municipio creado:", res.data);
        navigate("/municipios");
      })
      .catch((error) => {
        console.error("Error al guardar el municipio:", error);
        alert("Hubo un problema al guardar el municipio.");
      });
  };

  return (
    <>
      <NavMenu />
      <Container>
        <Row className="mt-3">
          <Col md={6}>
            <h3>{id ? "Actualizar Municipio" : "Crear Municipio"}</h3>
            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre del Municipio</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre"
                  name="nombre"
                  value={municipio.nombre}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingresa un nombre válido.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Latitud</Form.Label>
                <Form.Control
                  type="text"
                  value={municipio.latitud || ""}
                  readOnly
                  placeholder="Selecciona una ubicación en el mapa"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Longitud</Form.Label>
                <Form.Control
                  type="text"
                  value={municipio.longitud || ""}
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

export default FormMunicipio;
