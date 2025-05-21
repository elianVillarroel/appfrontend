import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const CompShowUnits = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getUnits();
    }, []);
    
    const getUnits = async () => {
        try {
            setLoading(true);
            const res = await axios.get(URI);
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
                await axios.delete(`${URI}/${id}`);
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
                <h2 className='text-primary'>Gestión de Unidades</h2>
                <Link to="/units/create" className='btn btn-primary'>
                    <i className="fas fa-plus me-2"></i>Nueva Unidad
                </Link>
            </div>
            
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="spinner-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className='table table-hover'>
                                <thead>
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
                                                <td>{unit.usuario}</td>
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
                                                        <Link 
                                                            to={`/units/edit/${unit.id}`} 
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Editar"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button 
                                                            onClick={() => deleteUnit(unit.id)} 
                                                            className='btn btn-sm btn-outline-danger'
                                                            title="Eliminar"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className='empty-state'>
                                                <i className="fas fa-building"></i>
                                                <p>No hay unidades registradas</p>
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