import axios from "axios";
import { useState } from "react";
import NavMenu from "../../components/NavMenu";
import { Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FormRegister = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onChangeRol = (e) => {
        setRol(e.target.value); // Actualiza el estado del rol
    };

    const onRegisterSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }
        setErrorText('');
        doRegister();
    };

    const doRegister = () => {
        const usuario = {
            email,
            password,
            rol, // Envía el rol seleccionado
        };
        axios.post('http://localhost:3000/usuarios', usuario)
            .then(res => {
                console.log(res.data);
                navigate('/');
            }).catch(error => {
                const errorMsg = error.response?.data?.msg || "Error al registrarse.";
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
                                    <h2>Registro</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={onRegisterSubmit}>
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
                                            required
                                            value={password}
                                            type="password"
                                            onChange={onChangePassword}
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
                                            required
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Administrador"
                                            value="administrador"
                                            name="rol"
                                            onChange={onChangeRol}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un rol.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mt-3">
                                        <Button type="submit">Regístrate</Button>
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

export default FormRegister;
