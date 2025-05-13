// src/Home.js
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="text-center">
                        <Card.Header as="h5">Sistema de Gestión</Card.Header>
                        <Card.Body>
                            <Card.Title>Seleccione una opción</Card.Title>
                            <div className="d-grid gap-3">
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    onClick={() => navigate('/messages')}
                                >
                                    Gestionar Mensajes
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="lg"
                                    onClick={() => navigate('/units')}
                                >
                                    Gestionar Usuarios
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;