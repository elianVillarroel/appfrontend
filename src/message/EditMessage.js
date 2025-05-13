import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const URI = 'https://appbackend-xer8.onrender.com/messages'

const CompEditMessage = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [fechaInicio, setFechaInicio] = useState('')
    const [fechaFin, setFechaFin] = useState('')
    const navigate = useNavigate()
    const {id} = useParams()

    // Wrap getMessageById in useCallback to memoize it
    const getMessageById = useCallback(async () => {
        const res = await axios.get(`${URI}/${id}`)
        setTitle(res.data.title)
        setDescription(res.data.description)
        setStatus(res.data.status)
        setFechaInicio(res.data.fechaInicio)
        setFechaFin(res.data.fechaFin)
    }, [id]) // Add dependencies here

    useEffect(() => {
        getMessageById()
    }, [getMessageById]) // Now getMessageById is properly included in dependencies

    const update = async (e) => {
        e.preventDefault()
        await axios.put(`${URI}/${id}`, {
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
            <h3>Edit Message</h3>
            <form onSubmit={update}>
                <div className='mb-3'>
                    <label className='form-label'>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className='form-control'
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='form-control'
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='form-control'
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
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>End Date</label>
                    <input
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        type="date"
                        className='form-control'
                    />
                </div>
                <button type='submit' className='btn btn-primary'>Update</button>
            </form>
        </div>
    )
}

export default CompEditMessage