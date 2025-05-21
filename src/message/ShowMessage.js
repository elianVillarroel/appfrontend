import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const URI = 'https://appbackend-xer8.onrender.com/messages'

const CompShowMessages = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        getMessages()
    }, [])
    
    const getMessages = async () => {
        try {
            setLoading(true)
            const res = await axios.get(URI)
            setMessages(res.data)
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
                await axios.delete(`${URI}/${id}`)
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
            case 'Publicado': return 'badge-secondary'
            case 'Pendiente': return 'badge-warning'
            case 'Expirado': return 'badge-light'
            case 'Rechazado': return 'badge-danger'
            default: return 'badge-primary'
        }
    }
    
    return (
        <div className='container-lg'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2 className='text-primary'>Gestión de Mensajes</h2>
                <Link to="/create" className='btn btn-primary'>
                    <i className="fas fa-plus me-2"></i>Nuevo Mensaje
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
                                        <th>Título</th>
                                        <th>Unidad Emisora</th>
                                        <th>Estado</th>
                                        <th>Inicio</th>
                                        <th>Fin</th>
                                        <th className='text-end'>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.length > 0 ? (
                                        messages.map((message) => (
                                            <tr key={message.id}>
                                                <td>
                                                    <strong>{message.title}</strong>
                                                    <div className='text-muted small'>
                                                        {message.description.substring(0, 60)}...
                                                    </div>
                                                </td>
                                                <td>
                                                    {message.unidad_emisora || 'Unidad organizacional'}
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
                                                    <div className='d-flex justify-content-end gap-2'>
                                                        <Link 
                                                            to={`/edit/${message.id}`} 
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Editar"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button 
                                                            onClick={() => deleteMessage(message.id)} 
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
                                            <td colSpan="6" className='empty-state'>
                                                <i className="fas fa-inbox"></i>
                                                <p>No hay mensajes registrados</p>
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