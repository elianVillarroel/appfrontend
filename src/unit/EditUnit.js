import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const UNIDADES_OPTIONS = [
    "Unidad Organizacional de Obras Públicas",
    "Unidad Organizacional de Movilidad",
    "Unidad Organizacional de Gobierno Electrónico",
    "Unidad Organizacional de Prensa e Imagen",
    "Unidad Organizacional de Tecnología"
];

const CompEditUnit = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [tipo, setTipo] = useState('input');
    const [unidad, setUnidad] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const getUnitById = useCallback(async () => {
        try {
            const res = await axios.get(`${URI}/${id}`);
            setUsuario(res.data.usuario);
            setContraseña(res.data.contraseña);
            setTipo(res.data.tipo);
            setUnidad(res.data.unidad || '');
        } catch (err) {
            console.error('Error al cargar unidad:', err);
            setError('No se pudo cargar la unidad');
        }
    }, [id]);

    useEffect(() => {
        getUnitById();
    }, [getUnitById]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!unidad.trim()) {
            setError('Debe seleccionar una unidad organizacional');
            setLoading(false);
            return;
        }

        try {
            await axios.put(`${URI}/${id}`, {
                usuario,
                contraseña,
                tipo,
                unidad
            });
            navigate('/units', { state: { success: 'Unidad actualizada correctamente' } });
        } catch (err) {
            console.error('Error al actualizar:', err);
            setError(err.response?.data?.message || 'Error al actualizar la unidad');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <h3>Editar Unidad</h3>
            
            {error && (
                <div className="alert alert-danger mb-3">
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdate}>
                <div className='mb-3'>
                    <label className='form-label'>Usuario</label>
                    <input
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        type="text"
                        className='form-control'
                        required
                        minLength={4}
                        maxLength={20}
                    />
                    <small className='text-muted'>Mínimo 4 caracteres</small>
                </div>
                
                <div className='mb-3'>
                    <label className='form-label'>Contraseña</label>
                    <input
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        type="password"
                        className='form-control'
                        required
                        minLength={6}
                    />
                    <small className='text-muted'>Mínimo 6 caracteres</small>
                </div>
                
                <div className='mb-3'>
                    <label className='form-label'>Unidad Organizacional</label>
                    <select
                        value={unidad}
                        onChange={(e) => setUnidad(e.target.value)}
                        className='form-control'
                        required
                    >
                        <option value="">Seleccionar unidad...</option>
                        {UNIDADES_OPTIONS.map((unidadOpt, index) => (
                            <option key={index} value={unidadOpt}>
                                {unidadOpt}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className='mb-3'>
                    <label className='form-label'>Tipo de Unidad</label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className='form-control'
                        required
                    >
                        <option value="input">Unidad de Entrada</option>
                        <option value="output">Unidad de Salida</option>
                        <option value="administrator">Administrador</option>
                    </select>
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/units')}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Actualizar
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompEditUnit;