import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const CompCreateUnit = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [tipo, setTipo] = useState('input');
    const [unidad, setUnidad] = useState('');
    const navigate = useNavigate();

    const store = async (e) => {
        e.preventDefault();
        
        // Validación básica
        if (!unidad.trim()) {
            alert('El campo Unidad es obligatorio');
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
        <div className='container mt-4'>
            <div className='card shadow-sm'>
                <div className='card-header bg-primary text-white'>
                    <h3 className='mb-0'>Crear Nueva Unidad</h3>
                </div>
                <div className='card-body'>
                    <form onSubmit={store}>
                        <div className='mb-3'>
                            <label className='form-label'>Usuario*</label>
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
                            <label className='form-label'>Contraseña*</label>
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
                            <label className='form-label'>Unidad Organizacional*</label>
                            <input
                                value={unidad}
                                onChange={(e) => setUnidad(e.target.value)}
                                type="text"
                                className='form-control'
                                required
                            />
                            <small className='text-muted'>Ej: Recursos Humanos, Tecnología</small>
                        </div>
                        
                        <div className='mb-3'>
                            <label className='form-label'>Tipo de Unidad*</label>
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
                        
                        <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
                            <button 
                                type='button' 
                                onClick={() => navigate('/units')}
                                className='btn btn-secondary me-md-2'
                            >
                                Cancelar
                            </button>
                            <button 
                                type='submit' 
                                className='btn btn-primary'
                            >
                                <i className="fas fa-save me-2"></i>Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateUnit;