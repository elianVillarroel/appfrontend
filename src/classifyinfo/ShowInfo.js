import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const URI = 'https://appbackend-xer8.onrender.com/messages'

const DESTINATARIOS_OPTIONS = [
    { 
        id: 1, 
        nombre: 'Recursos Humanos', 
        descripcion: 'Unidad organizacional de Prensa e Imagen' 
    },
    { 
        id: 2, 
        nombre: 'App Móvil', 
        descripcion: 'Unidad organizacional de Tecnología' 
    },
    { 
        id: 3, 
        nombre: 'API', 
        descripcion: 'Unidad organizacional de Gobierno Electrónico y Unidad organizacional de Tecnología' 
    },
    { 
        id: 4, 
        nombre: 'Email', 
        descripcion: 'Unidad organizacional de Tecnología' 
    }
]

const CompShowInfo = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [userDestinatarioId, setUserDestinatarioId] = useState(null)
    const navigate = useNavigate()
    
    const userData = JSON.parse(localStorage.getItem('unidad')) || {}
    const userUnit = userData.unidad 
    
    useEffect(() => {
        const destinatario = DESTINATARIOS_OPTIONS.find(d => 
            d.nombre.toLowerCase().includes(userUnit.toLowerCase()) || 
            d.descripcion.toLowerCase().includes(userUnit.toLowerCase())
        )
        
        if (destinatario) {
            setUserDestinatarioId(destinatario.id)
            getMessages(destinatario.id)
        } else {
            setLoading(false)
        }
    }, [userUnit])
    
    const getMessages = async (destinatarioId) => {
        try {
            setLoading(true)
            const res = await axios.get(URI, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            const filteredMessages = res.data.filter(message => {
                if (!message.destinatarios_csv) return false
                const destinatarios = message.destinatarios_csv.split(',').map(Number)
                return destinatarios.includes(destinatarioId)
            })
            
            setMessages(filteredMessages)
        } catch (error) {
            console.error('Error al obtener mensajes:', error)
            alert('Error al cargar los mensajes')
        } finally {
            setLoading(false)
        }
    }
    
    const formatDateTime = (dateStr, timeStr) => {
        if (!dateStr) return 'No definido'
        
        const date = new Date(dateStr)
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }
        const formattedDate = date.toLocaleDateString('es-ES', options)
        
        if (!timeStr) return formattedDate
        
        return `${formattedDate} - ${timeStr}`
    }
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'Publicado': return 'badge bg-success'
            case 'Pendiente': return 'badge bg-warning text-dark'
            case 'Expirado': return 'badge bg-light text-dark'
            case 'Rechazado': return 'badge bg-danger'
            default: return 'badge bg-primary'
        }
    }
    
    return (
        <div className='container-lg'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <div>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn btn-outline-secondary me-2"
                    >
                        <i className="fas fa-arrow-left me-2"></i>Volver
                    </button>
                    <h2 className='text-primary d-inline-block'>Información por clasificar</h2>
                </div>
                {userDestinatarioId && (
                    <div className="alert alert-info mb-0">
                        Mostrando información para: <strong>{userUnit}</strong>
                    </div>
                )}
            </div>
            
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando mensajes...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className='table table-hover'>
                                <thead className="table-light">
                                    <tr>
                                        <th>Título</th>
                                        <th>Unidad Emisora</th>
                                        <th>Estado</th>
                                        <th>Inicio</th>
                                        <th>Fin</th>
                                        <th className='text-end'>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.length > 0 ? (
                                        messages.map((message) => (
                                            <tr key={message.id}>
                                                <td>
                                                    <strong>{message.title}</strong>
                                                    <div className='text-muted small'>
                                                        {message.description?.substring(0, 60)}...
                                                    </div>
                                                </td>
                                                <td>
                                                    {message.unidad_emisora || 'Sin unidad'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusColor(message.status)}`}>
                                                        {message.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small className='text-nowrap'>
                                                        {formatDateTime(message.fechaInicio, message.hora_inicio)}
                                                    </small>
                                                </td>
                                                <td>
                                                    <small className='text-nowrap'>
                                                        {formatDateTime(message.fechaFin, message.hora_fin)}
                                                    </small>
                                                </td>
                                                <td className='text-end'>
                                                    <Link 
                                                        to={`/classify-info/${message.id}`} 
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        <i className="fas fa-edit me-1"></i> Clasificar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center py-5'>
                                                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                                <p className='h5'>No hay información para clasificar</p>
                                                {!userDestinatarioId && (
                                                    <small className='text-danger'>
                                                        No se encontró coincidencia entre su unidad y los destinatarios disponibles
                                                    </small>
                                                )}
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
    )
}

export default CompShowInfo