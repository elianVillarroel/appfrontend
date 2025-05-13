import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const URI = 'https://appbackend-xer8.onrender.com/messages'

const CompCreateMessage = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const navigate = useNavigate()

    const store = async (e) => {
        e.preventDefault()
        await axios.post(URI, {
            title: title, 
            description: description, 
            status: status, 
            fechaInicio: fechaInicio, 
            fechaFin: fechaFin
        })
        navigate('/')
    }

    return (
        <div className='container'>
            <h3>Create Message</h3>
            <form onSubmit={store}>
                <div className='mb-3'>
                    <label className='form-label'>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='form-control'
                        required
                    >
                        <option value="">Select status</option>
                        <option value="Rechazado">Rechazado</option>
                        <option value="Expirado">Expirado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Publicado">Publicado</option>
                    </select>
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Start Date</label>
                    <input
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        type="date"
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>End Date</label>
                    <input
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        type="date"
                        className='form-control'
                        required
                    />
                </div>
                <button type='submit' className='btn btn-primary'>Store</button>
            </form>
        </div>
    )
}

export default CompCreateMessage