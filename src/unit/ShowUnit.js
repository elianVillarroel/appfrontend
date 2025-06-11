import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const CompShowUnits = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('unidad')) || {};
    const isAdmin = userData.tipo === 'administrator';
    
    useEffect(() => {
        getUnits();
    }, []);
    
    const getUnits = async () => {
        try {
            setLoading(true);
            const res = await axios.get(URI, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUnits(res.data);
        } catch (error) {
            console.error('Error al obtener unidades:', error);
            alert('Error al cargar las unidades');
        } finally {
            setLoading(false);
        }
    };
    
    const deleteUnit = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta unidad?')) {
            try {
                await axios.delete(`${URI}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                getUnits();
                alert('Unidad eliminada correctamente');
            } catch (error) {
                console.error('Error al eliminar unidad:', error);
                alert('Error al eliminar la unidad');
            }
        }
    };

    const getTypeBadge = (type) => {
        switch(type) {
            case 'administrator': return 'badge-primary';
            case 'input': return 'badge-info';
            case 'output': return 'badge-secondary';
            default: return 'badge-light';
        }
    }
    
    return (
        <div className='container-lg'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <div>
                    <button 
                        onClick={() => navigate('/')} 
                        className="btn btn-outline-secondary me-2"
                    >
                        <i className="fas fa-arrow-left me-2"></i>Volver
                    </button>
                    <h2 className='text-primary d-inline-block'>Gestión de Unidades</h2>
                </div>
                {isAdmin && (
                    <Link to="/units/create" className='btn btn-primary'>
                        <i className="fas fa-plus me-2"></i>Nueva Unidad
                    </Link>
                )}
            </div>
            
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando unidades...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className='table table-hover'>
                                <thead className="table-light">
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Unidad Organizacional</th>
                                        <th>Tipo</th>
                                        <th className='text-end'>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.length > 0 ? (
                                        units.map((unit) => (
                                            <tr key={unit.id}>
                                                <td>
                                                    <strong>{unit.usuario}</strong>
                                                </td>
                                                <td>{unit.unidad}</td>
                                                <td>
                                                    <span className={`badge ${getTypeBadge(unit.tipo)}`}>
                                                        {unit.tipo === 'administrator' && 'Administrador'}
                                                        {unit.tipo === 'input' && 'Entrada'}
                                                        {unit.tipo === 'output' && 'Salida'}
                                                    </span>
                                                </td>
                                                <td className='text-end'>
                                                    <div className='d-flex justify-content-end gap-2'>
                                                        {isAdmin && (
                                                            <>
                                                                <Link 
                                                                    to={`/units/edit/${unit.id}`} 
                                                                    className="btn btn-sm btn-primary"
                                                                >
                                                                    <i className="fas fa-edit me-1"></i>Editar
                                                                </Link>
                                                                <button 
                                                                    onClick={() => deleteUnit(unit.id)} 
                                                                    className='btn btn-sm btn-danger'
                                                                >
                                                                    <i className="fas fa-trash-alt me-1"></i>Eliminar
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className='text-center py-4'>
                                                <div className="empty-state">
                                                    <i className="fas fa-building fa-3x text-muted mb-3"></i>
                                                    <p className="h5 text-muted">No hay unidades registradas</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompShowUnits;