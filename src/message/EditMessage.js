import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const URI = 'https://appbackend-xer8.onrender.com/messages'

// Datos de los destinatarios disponibles
const DESTINATARIOS_OPTIONS = [
    { id: 1, nombre: 'Recursos Humanos', descripcion: 'Prensa e imagen' },
    { id: 2, nombre: 'App Móvil', descripcion: 'Direccion de Tecnologia' },
    { id: 3, nombre: 'API', descripcion: 'Direccion de Gobierno Electronico, Direccion de Tecnologia' },
    { id: 4, nombre: 'Email', descripcion: 'Direccion de Tecnologia' }
]

const CompEditMessage = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [hora_inicio, setHoraInicio] = useState('')
    const [hora_fin, setHoraFin] = useState('')
    const [selectedDestinatarios, setSelectedDestinatarios] = useState([])
    const unidad_emisora = "Unidad organizacional" // Valor fijo
    const navigate = useNavigate()
    const {id} = useParams()

    const getMessageById = useCallback(async () => {
        const res = await axios.get(`${URI}/${id}`)
        setTitle(res.data.title)
        setDescription(res.data.description)
        setStatus(res.data.status)
        setFechaInicio(res.data.fechaInicio.split('T')[0]) // Formatear fecha
        setFechaFin(res.data.fechaFin?.split('T')[0] || '') // Formatear fecha con manejo de nulos
        setHoraInicio(res.data.hora_inicio || '08:00')
        setHoraFin(res.data.hora_fin || '17:00')
        
        // Inicializar destinatarios seleccionados desde el CSV
        if (res.data.destinatarios_csv) {
            setSelectedDestinatarios(res.data.destinatarios_csv.split(',').map(Number))
        }
    }, [id])

    useEffect(() => {
        getMessageById()
    }, [getMessageById])

    const handleDestinatarioChange = (destinatarioId) => {
        setSelectedDestinatarios(prev => {
            if (prev.includes(destinatarioId)) {
                return prev.filter(id => id !== destinatarioId)
            } else {
                return [...prev, destinatarioId]
            }
        })
    }

    const update = async (e) => {
        e.preventDefault()
        
        // Validación de fechas y horas
        const inicioCompleto = new Date(`${fechaInicio}T${hora_inicio}`)
        const finCompleto = new Date(`${fechaFin}T${hora_fin}`)
        
        if (finCompleto <= inicioCompleto) {
            alert('La fecha/hora de fin debe ser posterior a la de inicio')
            return
        }

        // Validar que se haya seleccionado al menos un destinatario
        if (selectedDestinatarios.length === 0) {
            alert('Por favor selecciona al menos un destinatario')
            return
        }

        // Convertir array de IDs a CSV
        const destinatarios_csv = selectedDestinatarios.join(',')

        try {
            await axios.put(`${URI}/${id}`, {
                title: title,
                description: description,
                status: status,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                hora_inicio: hora_inicio,
                hora_fin: hora_fin,
                unidad_emisora: unidad_emisora,
                destinatarios_csv: destinatarios_csv
            })
            navigate('/')
        } catch (error) {
            console.error('Error al actualizar mensaje:', error)
            alert('Error al actualizar el mensaje')
        }
    }

    return (
        <div className='container'>
            <h3>Editar Mensaje</h3>
            <form onSubmit={update}>
                <div className='mb-3'>
                    <label className='form-label'>Título</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Estado</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='form-control'
                        required
                    >
                        <option value="">Seleccionar estado</option>
                        <option value="Rechazado">Rechazado</option>
                        <option value="Expirado">Expirado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Publicado">Publicado</option>
                    </select>
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Fecha de inicio</label>
                    <input
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        type="date"
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Hora de inicio</label>
                    <input
                        value={hora_inicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        type="time"
                        className='form-control'
                        min="08:00"
                        max="18:00"
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Fecha de vencimiento</label>
                    <input
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        type="date"
                        className='form-control'
                        min={fechaInicio}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Hora de vencimiento</label>
                    <input
                        value={hora_fin}
                        onChange={(e) => setHoraFin(e.target.value)}
                        type="time"
                        className='form-control'
                        min={fechaInicio === fechaFin ? hora_inicio : '08:00'}
                        max="18:00"
                        required
                    />
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
                
                {/* Sección de Destinatarios */}
                <div className='mb-3'>
                    <label className='form-label'>Destinatarios (selecciona al menos uno)</label>
                    <div className='destinatarios-checklist'>
                        {DESTINATARIOS_OPTIONS.map(dest => (
                            <div key={dest.id} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`dest-${dest.id}`}
                                    checked={selectedDestinatarios.includes(dest.id)}
                                    onChange={() => handleDestinatarioChange(dest.id)}
                                />
                                <label className="form-check-label" htmlFor={`dest-${dest.id}`}>
                                    <strong>{dest.nombre}</strong> - {dest.descripcion}
                                </label>
                            </div>
                        ))}
                    </div>
                    {selectedDestinatarios.length === 0 && (
                        <div className="text-danger small">Debes seleccionar al menos un destinatario</div>
                    )}
                </div>

                <button type='submit' className='btn btn-primary'>Actualizar</button>
            </form>
        </div>
    )
}

export default CompEditMessage