/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import NavMenu from "../../components/NavMenu";

const FormRuta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [municipios, setMunicipios] = useState([]);
  const [carreteras, setCarreteras] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    estado: "libre",
    razonBloqueo: "",
    origenMunicipioId: "",
    destinoMunicipioId: "",
    carreteraId: "",
  });

  useEffect(() => {
    fetchMunicipios();
    fetchCarreteras();

    if (id) {
      getRutaById();
    }
  }, [id]);

  const fetchMunicipios = () => {
    axios
      .get("http://localhost:3000/municipios")
      .then((res) => setMunicipios(res.data))
      .catch((error) => console.error("Error al obtener municipios:", error));
  };

  const fetchCarreteras = () => {
    axios
      .get("http://localhost:3000/carreteras")
      .then((res) => setCarreteras(res.data))
      .catch((error) => console.error("Error al obtener carreteras:", error));
  };

  const getRutaById = () => {
    axios
      .get(`http://localhost:3000/rutas/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          nombre: data.nombre,
          estado: data.estado,
          razonBloqueo: data.razonBloqueo,
          origenMunicipioId: data.origenMunicipioId,
          destinoMunicipioId: data.destinoMunicipioId,
          carreteraId: data.carreteraId,
        });
      })
      .catch((error) => {
        console.error("Error al cargar los datos de la ruta:", error);
        alert("No se pudieron cargar los datos de la ruta.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.origenMunicipioId || !formData.destinoMunicipioId || !formData.carreteraId) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (id) {
      editRuta(formData);
    } else {
      insertRuta(formData);
    }
  };

  const editRuta = (data) => {
    const token = localStorage.getItem("token");

    axios
      .patch(`http://localhost:3000/rutas/${id}/edit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Ruta actualizada:", res.data);
        navigate("/rutas");
      })
      .catch((error) => {
        console.error("Error al actualizar la ruta:", error);
        alert("Hubo un problema al actualizar la ruta.");
      });
  };

  const insertRuta = (data) => {
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:3000/rutas", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Ruta creada:", res.data);
        navigate("/rutas");
      })
      .catch((error) => {
        console.error("Error al guardar la ruta:", error);
        alert("Hubo un problema al guardar la ruta.");
      });
  };

  return (
    <>
    <NavMenu/>
    <Container className="mt-4">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center">
                {id ? "Editar Ruta" : "Agregar Ruta"}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Label>Nombre de la Ruta</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  >
                    <option value="libre">Libre</option>
                    <option value="bloqueada">Bloqueada</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="razonBloqueo">
                  <Form.Label>Razón de Bloqueo</Form.Label>
                  <Form.Control
                    type="text"
                    name="razonBloqueo"
                    value={formData.razonBloqueo}
                    onChange={handleChange}
                    disabled={formData.estado === "libre"}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="origenMunicipioId">
                  <Form.Label>Municipio de Origen</Form.Label>
                  <Form.Select
                    name="origenMunicipioId"
                    value={formData.origenMunicipioId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un municipio</option>
                    {municipios.map((municipio) => (
                      <option key={municipio.id} value={municipio.id}>
                        {municipio.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="destinoMunicipioId">
                  <Form.Label>Municipio de Destino</Form.Label>
                  <Form.Select
                    name="destinoMunicipioId"
                    value={formData.destinoMunicipioId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un municipio</option>
                    {municipios.map((municipio) => (
                      <option key={municipio.id} value={municipio.id}>
                        {municipio.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="carreteraId">
                  <Form.Label>Carretera</Form.Label>
                  <Form.Select
                    name="carreteraId"
                    value={formData.carreteraId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una carretera</option>
                    {carreteras.map((carretera) => (
                      <option key={carretera.id} value={carretera.id}>
                        {carretera.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  {id ? "Actualizar Ruta" : "Agregar Ruta"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default FormRuta;
