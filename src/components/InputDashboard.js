import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const InputDashboard = () => {
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
            <h2 className="mb-4 text-center">Panel de Usuario Input</h2>
            <Row className="g-4">
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <Card.Title>Gestión de información</Card.Title>
                            <Card.Text>
                                Crear, editar, eliminar y visualizar información.
                            </Card.Text>
                            <Button 
                                variant="primary" 
                                onClick={() => navigate('/messages')}
                                className="w-100"
                            >
                                Administrar información
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <Card.Title>Crear</Card.Title>
                            <Card.Text>
                                Publica informacion en el sistema.
                            </Card.Text>
                            <Button 
                                variant="success" 
                                onClick={() => navigate('/create')}
                                className="w-100"
                            >
                                Nuevo
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InputDashboard;