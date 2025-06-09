import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/messages';

const CompClassifyInfo = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [hora_inicio, setHoraInicio] = useState('');
    const [hora_fin, setHoraFin] = useState('');
    const [unidad_emisora, setUnidadEmisora] = useState('');
    const [destinatarios, setDestinatarios] = useState('');
    const [imagen_url, setImagenUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    const formatDate = useCallback((dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }, []);

    const getMessageById = useCallback(async () => {
        const res = await axios.get(`${URI}/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setStatus(res.data.status);
        setFechaInicio(formatDate(res.data.fechaInicio));
        setFechaFin(formatDate(res.data.fechaFin));
        setHoraInicio(res.data.hora_inicio || '08:00');
        setHoraFin(res.data.hora_fin || '17:00');
        setUnidadEmisora(res.data.unidad_emisora);
        setImagenUrl(res.data.imagen_url || '');
        
        if (res.data.destinatarios_csv) {
            const dests = res.data.destinatarios_csv.split(',').map(Number);
            setDestinatarios(dests.join(', '));
        }
    }, [id, formatDate]);

    useEffect(() => {
        getMessageById();
    }, [getMessageById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await axios.put(`${URI}/${id}`, {
                status: status
            });
            navigate('/classify-info');
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert('Error al actualizar el estado del mensaje');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <h3>Clasificar Mensaje</h3>
            
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    
                    {imagen_url && (
                        <div className="mb-3 text-center">
                            <img 
                                src={imagen_url} 
                                alt="Adjunto del mensaje" 
                                className="img-fluid rounded"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className='row mb-3'>
                            <div className='col-md-6'>
                                <label className='form-label'>Fecha de inicio</label>
                                <input
                                    value={fechaInicio}
                                    type="text"
                                    className='form-control'
                                    readOnly
                                />
                            </div>
                            <div className='col-md-6'>
                                <label className='form-label'>Hora de inicio</label>
                                <input
                                    value={hora_inicio}
                                    type="text"
                                    className='form-control'
                                    readOnly
                                />
                            </div>
                        </div>
                        
                        <div className='row mb-3'>
                            <div className='col-md-6'>
                                <label className='form-label'>Fecha de vencimiento</label>
                                <input
                                    value={fechaFin}
                                    type="text"
                                    className='form-control'
                                    readOnly
                                />
                            </div>
                            <div className='col-md-6'>
                                <label className='form-label'>Hora de vencimiento</label>
                                <input
                                    value={hora_fin}
                                    type="text"
                                    className='form-control'
                                    readOnly
                                />
                            </div>
                        </div>
                        
                        <div className='mb-3'>
                            <label className='form-label'>Unidad Emisora</label>
                            <input
                                value={unidad_emisora}
                                type="text"
                                className='form-control'
                                readOnly
                            />
                        </div>
                        
                        <div className='mb-3'>
                            <label className='form-label'>Destinatarios</label>
                            <input
                                value={destinatarios}
                                type="text"
                                className='form-control'
                                readOnly
                            />
                        </div>
                        
                        <div className='mb-4'>
                            <label className='form-label'>Estado actual</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className='form-control'
                                required
                            >
                                <option value="">Seleccionar nuevo estado</option>
                                <option value="Rechazado">Rechazado</option>
                                <option value="Expirado">Expirado</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Publicado">Publicado</option>
                            </select>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => navigate('/classify-info')}
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
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Actualizando...
                                    </>
                                ) : 'Actualizar Estado'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompClassifyInfo;