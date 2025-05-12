import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


const URI = 'https://appbackend-xer8.onrender.com/messages'

const CompShowMessages = () => {
    const [messages, setMessages] = useState([])
    
    useEffect(() => {
        getMessages()
    }, [])
    
    const getMessages = async () => {
        const res = await axios.get(URI)
        setMessages(res.data)
    }
    
    const deleteMessage = async (id) => {
        await axios.delete(`${URI}/${id}`)
        getMessages()
    }
    
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Link to="/create" className='btn btn-primary mt-2 mb-2'>Crear</Link>
                    <table className='table'>
                        <thead className='table-primary'>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Date1</th>
                                <th>Date2</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message.id}>
                                    <td>{message.title}</td>
                                    <td>{message.description}</td>
                                    <td>{message.status}</td>
                                    <td>{message.fechaInicio}</td>
                                    <td>{message.fechaFin}</td>
                                    <td> 
                                        <Link to={`/edit/${message.id}`} className="btn btn-info">Editar</Link>
                                        <button onClick={() => deleteMessage(message.id)} className='btn btn-danger'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CompShowMessages