import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const URI = 'https://appbackend-xer8.onrender.com/messages'

const DESTINATARIOS_OPTIONS = [
    { id: 1, nombre: 'Recursos Humanos', descripcion: 'Prensa e imagen' },
    { id: 2, nombre: 'App Móvil', descripcion: 'Direccion de Tecnologia' },
    { id: 3, nombre: 'API', descripcion: 'Direccion de Gobierno Electronico, Direccion de Tecnologia' },
    { id: 4, nombre: 'Email', descripcion: 'Direccion de Tecnologia' }
]

const CompCreateMessage = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const [hora_inicio, setHoraInicio] = useState('')
    const [hora_fin, setHoraFin] = useState('')
    const [unidad_emisora, setUnidadEmisora] = useState('Unidad Organizacional')
    const [selectedDestinatarios, setSelectedDestinatarios] = useState([])
    const navigate = useNavigate()

    const handleDestinatarioChange = (destinatarioId) => {
        setSelectedDestinatarios(prev => {
            if (prev.includes(destinatarioId)) {
                return prev.filter(id => id !== destinatarioId)
            } else {
                return [...prev, destinatarioId]
            }
        })
    }

    const store = async (e) => {
        e.preventDefault()
        if (selectedDestinatarios.length === 0) {
            alert('Por favor selecciona al menos un destinatario')
            return
        }
        // Convertir array de IDs a CSV
        const destinatarios_csv = selectedDestinatarios.join(',')
        await axios.post(URI, {
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
    }

    return (
        <div className='container'>
            <h3>Create Message</h3>
            <form onSubmit={store}>
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
                        min="08:00"
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
                <button type='submit' className='btn btn-primary'>Enviar</button>
            </form>
        </div>
    )
}

export default CompCreateMessage