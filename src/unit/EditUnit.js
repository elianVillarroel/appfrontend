import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const CompEditUnit = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [tipo, setTipo] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const getUnitById = useCallback(async () => {
        const res = await axios.get(`${URI}/${id}`);
        setUsuario(res.data.usuario);
        setContraseña(res.data.contraseña);
        setTipo(res.data.tipo);
    }, [id]);

    useEffect(() => {
        getUnitById();
    }, [getUnitById]);

    const update = async (e) => {
        e.preventDefault();
        await axios.put(`${URI}/${id}`, {
            usuario: usuario,
            contraseña: contraseña,
            tipo: tipo
        });
        navigate('/units');
    }

    return (
        <div className='container'>
            <h3>Editar Unidad</h3>
            <form onSubmit={update}>
                <div className='mb-3'>
                    <label className='form-label'>Usuario</label>
                    <input
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        type="text"
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Contraseña</label>
                    <input
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        type="password"
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Tipo</label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className='form-control'
                        required
                    >
                        <option value="input">Entrada</option>
                        <option value="output">Salida</option>
                        <option value="administrator">Administrador</option>
                    </select>
                </div>
                <button type='submit' className='btn btn-primary me-2'>Actualizar</button>
                <Link to="/units" className='btn btn-secondary'>Cancelar</Link>
            </form>
        </div>
    );
};

export default CompEditUnit;