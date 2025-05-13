import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const URI = 'https://appbackend-xer8.onrender.com/unidades';

const CompShowUnits = () => {
    const [units, setUnits] = useState([]);
    
    useEffect(() => {
        getUnits();
    }, []);
    
    const getUnits = async () => {
        const res = await axios.get(URI);
        setUnits(res.data);
    };
    
    const deleteUnit = async (id) => {
        await axios.delete(`${URI}/${id}`);
        getUnits();
    };
    
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <Link to="/units/create" className='btn btn-primary mt-2 mb-2'>Crear</Link>
                    <table className='table'>
                        <thead className='table-primary'>
                            <tr>
                                <th>Usuario</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map((unit) => (
                                <tr key={unit.id}>
                                    <td>{unit.usuario}</td>
                                    <td>
                                        {unit.tipo === 'administrator' && 'Administrador'}
                                        {unit.tipo === 'input' && 'Entrada'}
                                        {unit.tipo === 'output' && 'Salida'}
                                    </td>
                                    <td> 
                                        <Link to={`/units/edit/${unit.id}`} className="btn btn-info">Editar</Link>
                                        <button 
                                            onClick={() => deleteUnit(unit.id)} 
                                            className='btn btn-danger ms-2'
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompShowUnits;