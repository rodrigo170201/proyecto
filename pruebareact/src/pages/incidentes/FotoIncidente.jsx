import axios from "axios";
import { useState } from "react";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FotoIncidente = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [fotoIncidente, setFotoIncidente] = useState(null);
    const [validated, setValidated] = useState(false);

    const onChangeFoto = (e) => {
        setFotoIncidente(e.target.files[0]);
    };

    const onGuardarClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const formData = new FormData();
        formData.append('fotoIncidente', fotoIncidente);
        const token = localStorage.getItem("token");
        
        axios.post(`http://localhost:3000/incidentes/${id}/foto`, formData,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
            .then(res => {
                console.log(res.data);
                navigate(`/incidentes`);
            })
            .catch(error => {
                console.error("Error al subir la foto:", error);
            });
    };

    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-3 mb-3">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Foto del Incidente</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                    <Form.Group>
                                        <Form.Label>Seleccione una imagen:</Form.Label>
                                        <Form.Control
                                            required
                                            type="file"
                                            onChange={onChangeFoto}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un archivo.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Button type="submit">Guardar Foto</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FotoIncidente;
