import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';

const CompLogin = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await axios.post('https://appbackend-xer8.onrender.com/auth/login', {
                usuario,
                contraseña,
            });

            if (!res.data.token || !res.data.unidad || !res.data.unidad.tipo) {
                throw new Error('Respuesta del servidor incompleta');
            }

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('unidad', JSON.stringify(res.data.unidad));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={4}>
                        <Card className="shadow-lg">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <img 
                                        src="/logo192.png" 
                                        alt="Logo" 
                                        className="login-logo mb-3"
                                        style={{ height: '80px' }}
                                    />
                                    <h2 className="text-primary">Inicio de Sesión</h2>
                                    <p className="text-muted">Ingrese sus credenciales para continuar</p>
                                </div>
                                
                                {error && (
                                    <Alert variant="danger" className="text-center">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Usuario</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-user"></i>
                                            </span>
                                            <Form.Control
                                                type="text"
                                                value={usuario}
                                                onChange={(e) => setUsuario(e.target.value)}
                                                placeholder="Ingrese su usuario"
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">Contraseña</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-lock"></i>
                                            </span>
                                            <Form.Control
                                                type="password"
                                                value={contraseña}
                                                onChange={(e) => setContraseña(e.target.value)}
                                                placeholder="Ingrese su contraseña"
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        className="w-100 py-2 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Cargando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Iniciar Sesión
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CompLogin;