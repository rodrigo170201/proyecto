import axios from "axios";
import { useEffect, useState } from "react";
import NavMenu from "../../components/NavMenu";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const FormUsuario = () => {
    useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (!id) return;
        getUsuarioById();
    }, [id]);

    const getUsuarioById = () => {
        axios.get(`http://localhost:3000/usuarios/${id}`)
            .then(res => {
                const usuario = res.data;
                setEmail(usuario.email);
                setRol(usuario.rol); // Configura el rol actual desde la base de datos
            })
            .catch(error => {
                console.log(error);
            });
    };

    const onChangeEmail = (e) => setEmail(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onChangeRol = (e) => setRol(e.target.value);

    const onGuardarClick = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        setErrorText('');
        const usuario = {
            email,
            password: !id ? password : undefined, // Solo envía contraseña si es nuevo usuario
            rol, // Incluye el rol
        };
        id ? editUsuario(usuario) : insertUsuario(usuario);
    };

    const editUsuario = (usuario) => {
        axios.patch(`http://localhost:3000/usuarios/${id}/edit`, usuario, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(res.data);
                navigate('/usuarios');
            })
            .catch(error => {
                const errorMsg = error.response?.data?.msg || "Error al actualizar el usuario.";
                setErrorText(errorMsg);
                console.log(error);
            });
    };

    const insertUsuario = (usuario) => {
        axios.post('http://localhost:3000/usuarios', usuario, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(res.data);
                navigate('/usuarios');
            })
            .catch(error => {
                const errorMsg = error.response?.data?.msg || "Error al registrar el usuario.";
                setErrorText(errorMsg);
                console.log(error);
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
                                    <h2>{id ? "Editar Usuario" : "Registro de Usuario"}</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                    {errorText && <Alert variant="danger">{errorText}</Alert>}
                                    <Form.Group>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control
                                            required
                                            value={email}
                                            type="email"
                                            onChange={onChangeEmail}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un correo válido.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            required={!id}
                                            value={password}
                                            type="password"
                                            onChange={onChangePassword}
                                            disabled={!!id} // Si hay ID, el campo es editable pero no obligatorio
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese una contraseña.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Selecciona tu rol:</Form.Label>
                                        <Form.Check
                                            type="radio"
                                            label="Verificador"
                                            value="verificador"
                                            name="rol"
                                            onChange={onChangeRol}
                                            checked={rol === "verificador"}
                                            required
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Administrador"
                                            value="administrador"
                                            name="rol"
                                            onChange={onChangeRol}
                                            checked={rol === "administrador"}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un rol.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mt-3">
                                        <Button type="submit">{id ? "Guardar cambios" : "Registrar usuario"}</Button>
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

export default FormUsuario;
