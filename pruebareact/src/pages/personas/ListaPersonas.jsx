import { Container, Row, Col, Card } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";

const ListaPersonas = () => {
    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Bienvenido</h2>
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ListaPersonas;
