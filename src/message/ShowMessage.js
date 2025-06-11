import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const URI = 'https://appbackend-xer8.onrender.com/messages'

const CompShowMessages = () => {
    const [allMessages, setAllMessages] = useState([])
    const [filteredMessages, setFilteredMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const userData = JSON.parse(localStorage.getItem('unidad')) || {}
    const userUnit = userData.unidad 
    const isAdmin = userData.tipo === 'administrator'
    const navigate = useNavigate()
    
    useEffect(() => {
        getMessages()
    }, [])
    
    const getMessages = async () => {
        try {
            setLoading(true)
            const res = await axios.get(URI, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            setAllMessages(res.data)

            if (isAdmin) {
                setFilteredMessages(res.data)
            } else if (userUnit) {
                const filtered = res.data.filter(message => 
                    message.unidad_emisora === userUnit
                )
                setFilteredMessages(filtered)
            } else {
                setFilteredMessages([])
            }
        } catch (error) {
            console.error('Error al obtener mensajes:', error)
            alert('Error al cargar los mensajes')
        } finally {
            setLoading(false)
        }
    }
    
    const deleteMessage = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            try {
                await axios.delete(`${URI}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                getMessages()
                alert('Mensaje eliminado correctamente')
            } catch (error) {
                console.error('Error al eliminar mensaje:', error)
                alert('Error al eliminar el mensaje')
            }
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
                        onClick={() => navigate('/')} 
                        className="btn btn-outline-secondary me-2"
                    >
                        <i className="fas fa-arrow-left me-2"></i>Volver
                    </button>
                    <h2 className='text-primary d-inline-block'>Gestión de información</h2>
                </div>
                {(isAdmin || userData.tipo === 'input') && (
                    <Link to="/create" className='btn btn-primary'>
                        <i className="fas fa-plus me-2"></i>Nuevo
                    </Link>
                )}
            </div>
            
            {!isAdmin && userUnit && (
                <div className="alert alert-info mb-4">
                    Mostrando mensajes de su unidad: <strong>{userUnit}</strong>
                </div>
            )}
            
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className='table table-hover'>
                                <thead className="table-light">
                                    <tr>
                                        <th>Título</th>
                                        {isAdmin && <th>Unidad Emisora</th>}
                                        <th>Estado</th>
                                        <th>Inicio</th>
                                        <th>Fin</th>
                                        <th className='text-end'>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMessages.length > 0 ? (
                                        filteredMessages.map((message) => (
                                            <tr key={message.id}>
                                                <td>
                                                    <strong>{message.title}</strong>
                                                    <div className='text-muted small'>
                                                        {message.description?.substring(0, 60)}...
                                                    </div>
                                                </td>
                                                {isAdmin && (
                                                    <td>
                                                        {message.unidad_emisora || 'Sin unidad'}
                                                    </td>
                                                )}
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
                                                    <div className='d-flex justify-content-end gap-2'>
                                                        <Link 
                                                            to={`/edit/${message.id}`} 
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            <i className="fas fa-edit me-1"></i>Editar
                                                        </Link>
                                                        <button 
                                                            onClick={() => deleteMessage(message.id)} 
                                                            className='btn btn-sm btn-danger'
                                                        >
                                                            <i className="fas fa-trash-alt me-1"></i>Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? 6 : 5} className='text-center py-4'>
                                                <div className="empty-state">
                                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                                    <p className="h5 text-muted">No hay mensajes para mostrar</p>
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
    )
}

export default CompShowMessages