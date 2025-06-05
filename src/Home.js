import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import InputDashboard from './components/InputDashboard';
import OutputDashboard from './components/OutputDashboard';

const Home = () => {
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('unidad'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token || !userData) {
            navigate('/login');
            return;
        }

        if (!userData.tipo) {
            console.error('Datos de usuario incompletos en localStorage');
            navigate('/login');
        }
    }, [navigate, token, userData]);

    if (!token || !userData) {
        return null; 
    }

    switch(userData.tipo) {
        case 'administrator':
            return <AdminDashboard />;
        case 'input':
            return <InputDashboard />;
        case 'output':
            return <OutputDashboard />;
        default:
            navigate('/login');
            return null;
    }
};

export default Home;