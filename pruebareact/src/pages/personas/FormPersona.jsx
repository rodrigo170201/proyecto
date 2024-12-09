import axios from "axios";
import { useEffect, useState } from "react";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../hooks/useAuth";

const FormPersona = () => {
    const navigate = useNavigate();
    useAuth();

    const { id } = useParams();
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [edad, setEdad] = useState('')
    const [fechaNacimiento, setFechaNacimiento] = useState('')
    const [genero, setGenero] = useState('1')
    const [usuarioId, setUsuarioId] = useState('')

    const [usuarioList, setUsuarioList] = useState([]);
    const [validated, setValidated] = useState(false);
    useEffect(() => {
        if (!id) return;
        getPersonaById();
    }, [id])

    useEffect(() => {
        getListaUsuarios();
    }, [])
    const getPersonaById = () => {
        axios.get(`http://localhost:3000/personas/${id}`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            }
        )
            .then(res => {
                const persona = res.data;
                setNombre(persona.nombre);
                setApellido(persona.apellido);
                setCiudad(persona.ciudad);
                setEdad(persona.edad);
                setFechaNacimiento(moment(persona.fechaNacimiento).format('YYYY-MM-DD'));
                setGenero(persona.genero);
                setUsuarioId(persona.usuarioId);
            }).catch(error => {
                console.log(error);
            });
    }
    const getListaUsuarios = () => {
        axios.get('http://localhost:3000/usuarios')
            .then(res => {
                setUsuarioList(res.data);
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onChangeNombre = (e) => {
        setNombre(e.target.value);
    }
    const onGuardarClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }
        const persona = {
            nombre,
            apellido,
            ciudad,
            edad,
            fechaNacimiento,
            genero,
            usuarioId
        };
        console.log(persona);
        if (id) {
            editPersona(persona);
        } else {
            insertPersona(persona);
        }

    }
    const editPersona = (persona) => {
        axios.put(`http://localhost:3000/personas/${id}`, persona, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(res.data);
                navigate('/personas');
            }).catch(error => {
                console.log(error);
            });
    }
    const insertPersona = (persona) => {
        axios.post('http://localhost:3000/personas', persona, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(res.data);
                navigate('/personas');
            }).catch(error => {
                console.log(error);
            });
    }
    return (
        <>
            <NavMenu />
            <Container>
                <Row className="mt-3 mb-3">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Formulario Persona</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                    <Form.Group >
                                        <Form.Label>Nombre:</Form.Label>
                                        <Form.Control required value={nombre} type="text" onChange={onChangeNombre} />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un nombre.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Apellido:</Form.Label>
                                        <Form.Control required value={apellido} type="text" onChange={(e) => {
                                            setApellido(e.target.value);
                                        }} />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un apellido.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Edad:</Form.Label>
                                        <Form.Control required value={edad} type="number" onChange={(e) => {
                                            setEdad(e.target.value);
                                        }} />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese la edad.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Ciudad:</Form.Label>
                                        <Form.Control required value={ciudad} type="text" onChange={(e) => {
                                            setCiudad(e.target.value);
                                        }} />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese la ciudad.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Fecha de nacimiento:</Form.Label>
                                        <Form.Control required value={fechaNacimiento} type="date" onChange={(e) => {
                                            setFechaNacimiento(e.target.value);
                                        }} />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese una fecha válida.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Género:</Form.Label>
                                        <Form.Select required value={genero} onChange={(e) => {
                                            setGenero(e.target.value);
                                        }} >
                                            <option value="1">Masculino</option>
                                            <option value="0">Femenino</option>
                                            <option value="-1">Indefinido</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un género.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Usuario:</Form.Label>
                                        <Form.Select required value={usuarioId} onChange={(e) => {
                                            setUsuarioId(e.target.value);
                                        }} >
                                            <option value="">Seleccione un Usuario...</option>
                                            {usuarioList.map(usuario =>
                                                <option key={"user-" + usuario.id} value={usuario.id}>{usuario.email}</option>
                                            )}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un usuario.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Button type="submit">Guardar datos</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>);
}

export default FormPersona;