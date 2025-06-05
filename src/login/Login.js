// src/login/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const CompLogin = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('https://appbackend-xer8.onrender.com/auth/login', {
            usuario,
            contraseña,
        });

        // Verificar que la respuesta tenga la estructura esperada
        if (!res.data.token || !res.data.unidad || !res.data.unidad.tipo) {
            throw new Error('Respuesta del servidor incompleta');
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('unidad', JSON.stringify(res.data.unidad));
        navigate('/');
    } catch (err) {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
};

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center">Inicio de Sesión</h2>
            <Form onSubmit={handleLogin}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Iniciar Sesión
                </Button>
            </Form>
        </Container>
    );
};

export default CompLogin;