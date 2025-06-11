import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const UNIDADES_OPTIONS = [
    "Unidad Organizacional de Obras Públicas",
    "Unidad Organizacional de Movilidad",
    "Unidad Organizacional de Gobierno Electrónico",
    "Unidad Organizacional de Prensa e Imagen",
    "Unidad Organizacional de Tecnología"
];

const CompCreateUnit = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [tipo, setTipo] = useState('input');
    const [unidad, setUnidad] = useState('');
    const navigate = useNavigate();

    const store = async (e) => {
        e.preventDefault();
        
        if (!unidad.trim()) {
            alert('Debe seleccionar una unidad organizacional');
            return;
        }

        try {
            await axios.post(URI, {
                usuario: usuario,
                contraseña: contraseña,
                tipo: tipo,
                unidad: unidad
            });
            alert('Unidad creada exitosamente');
            navigate('/units');
        } catch (error) {
            console.error('Error al crear unidad:', error);
            alert(error.response?.data?.message || 'Error al crear la unidad');
        }
    };

    return (
        <div className='container'>
            <h3>Crear Nueva Unidad</h3>
            <form onSubmit={store}>
                <div className='mb-3'>
                    <label className='form-label'>Usuario</label>
                    <input
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        type="text"
                        className='form-control'
                        required
                        minLength={4}
                        maxLength={20}
                    />
                    <small className='text-muted'>Mínimo 4 caracteres</small>
                </div>
                
                <div className='mb-3'>
                    <label className='form-label'>Contraseña</label>
                    <input
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        type="password"
                        className='form-control'
                        required
                        minLength={6}
                    />
                    <small className='text-muted'>Mínimo 6 caracteres</small>
                </div>
                
                <div className='mb-3'>
                    <label className='form-label'>Unidad Organizacional</label>
                    <select
                        value={unidad}
                        onChange={(e) => setUnidad(e.target.value)}
                        className='form-control'
                        required
                    >
                        <option value="">Seleccionar unidad...</option>
                        {UNIDADES_OPTIONS.map((unidadOpt, index) => (
                            <option key={index} value={unidadOpt}>
                                {unidadOpt}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className='mb-3'>
                    <label className='form-label'>Tipo de Unidad</label>
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        className='form-control'
                        required
                    >
                        <option value="input">Unidad de Entrada</option>
                        <option value="output">Unidad de Salida</option>
                        <option value="administrator">Administrador</option>
                    </select>
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/units')}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                    >
                        <i className="fas fa-save me-2"></i>Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateUnit;