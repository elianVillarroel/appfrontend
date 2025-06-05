import { Navigate } from 'react-router-dom';

const CompPrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('unidad'));

    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default CompPrivateRoute;