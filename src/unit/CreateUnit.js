import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const CompCreateUnit = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [tipo, setTipo] = useState('input');
    const navigate = useNavigate();

    const store = async (e) => {
        e.preventDefault();
        await axios.post(URI, {
            usuario: usuario,
            contraseña: contraseña,
            tipo: tipo
        });
        navigate('/units');
    };

    return (
        <div className='container'>
            <h3>Crear Unidad</h3>
            <form onSubmit={store}>
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
                <button type='submit' className='btn btn-primary'>Guardar</button>
            </form>
        </div>
    );
};

export default CompCreateUnit;