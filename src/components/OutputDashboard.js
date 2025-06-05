import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const OutputDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('unidad');
        window.location.href = '/login';
    };

    return (
        <Container className="mt-5">
            <div className="text-end mb-3">
                <Button onClick={handleLogout} variant="danger" size="sm">
                    Cerrar sesión
                </Button>
            </div>
            <h2 className="mb-4 text-center">Panel de Usuario Output</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>Visualización de Mensajes</Card.Title>
                            <Card.Text>
                                Visualiza y cambia el estado de los mensajes asignados a tu unidad.
                            </Card.Text>
                            <Button 
                                variant="primary" 
                                size="lg"
                                onClick={() => navigate('/messages')}
                                className="w-100"
                            >
                                Ver Mensajes
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OutputDashboard;