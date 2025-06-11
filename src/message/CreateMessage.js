import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const URI = 'https://appbackend-xer8.onrender.com/messages';

const CLOUDINARY_CLOUD_NAME = 'dk6hzfbys';
const CLOUDINARY_UPLOAD_PRESET = 'proyecto';

const DESTINATARIOS_OPTIONS = [
    { 
        id: 1, 
        nombre: 'Recursos Humanos', 
        descripcion: 'Unidad organizacional de Prensa e Imagen' 
    },
    { 
        id: 2, 
        nombre: 'App Móvil', 
        descripcion: 'Unidad organizacional de Tecnología' 
    },
    { 
        id: 3, 
        nombre: 'API', 
        descripcion: 'Unidad organizacional de Gobierno Electrónico y Unidad organizacional de Tecnología' 
    },
    { 
        id: 4, 
        nombre: 'Email', 
        descripcion: 'Unidad organizacional de Tecnología' 
    }
];

const CompCreateMessage = () => {
    // Estados para los campos del formulario
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [hora_inicio, setHoraInicio] = useState('');
    const [hora_fin, setHoraFin] = useState('');
    const [unidad_emisora, setUnidadEmisora] = useState('');
    const [selectedDestinatarios, setSelectedDestinatarios] = useState([]);
    
    // Estados para la imagen
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const navigate = useNavigate();

    // Configuración del área de dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxFiles: 1,
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            setFile(file);
            
            // Crear vista previa
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar selección de destinatarios
    const handleDestinatarioChange = (destinatarioId) => {
        setSelectedDestinatarios(prev => {
            if (prev.includes(destinatarioId)) {
                return prev.filter(id => id !== destinatarioId);
            } else {
                return [...prev, destinatarioId];
            }
        });
    };

    // Subir imagen a Cloudinary
    const uploadImage = async () => {
        if (!file) return null;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen. Por favor intenta nuevamente.');
            return null;
        } finally {
            setUploading(false);
        }
    };
        // Obtener la unidad del usuario al cargar el componente
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('unidad'));
        if (userData && userData.unidad) {
            setUnidadEmisora(userData.unidad);
        }
    }, []);

    // Enviar el formulario
    const store = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (selectedDestinatarios.length === 0) {
            alert('Por favor selecciona al menos un destinatario');
            return;
        }

        // Subir imagen primero si existe
        let imageUrl = '';
        if (file) {
            imageUrl = await uploadImage();
            if (!imageUrl) {
                return; // El error ya se mostró en uploadImage
            }
        }

        // Convertir array de IDs a CSV
        const destinatarios_csv = selectedDestinatarios.join(',');

        try {
            await axios.post(URI, {
                title: title, 
                description: description, 
                status: status, 
                fechaInicio: fechaInicio, 
                fechaFin: fechaFin,
                hora_inicio: hora_inicio,
                hora_fin: hora_fin,
                unidad_emisora: unidad_emisora,
                destinatarios_csv: destinatarios_csv,
                imagen_url: imageUrl || null
            });
            navigate('/');
        } catch (error) {
            console.error('Error creating message:', error);
            alert('Error al crear el mensaje. Por favor intenta nuevamente.');
        }
    };

    return (
        <div className='container'>
            <h3>Crear Mensaje</h3>
            <form onSubmit={store}>
                {/* Campos del formulario */}
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
                        rows={4}
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
                
                <div className='row mb-3'>
                    <div className='col-md-6'>
                        <label className='form-label'>Fecha de inicio</label>
                        <input
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            type="date"
                            className='form-control'
                            required
                        />
                    </div>
                    <div className='col-md-6'>
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
                </div>
                
                <div className='row mb-3'>
                    <div className='col-md-6'>
                        <label className='form-label'>Fecha de vencimiento</label>
                        <input
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            type="date"
                            className='form-control'
                            required
                        />
                    </div>
                    <div className='col-md-6'>
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
                
                {/* Área para subir imagen */}
                <div className='mb-3'>
                    <label className='form-label'>Imagen (opcional)</label>
                    <div 
                        {...getRootProps()} 
                        className={`dropzone border rounded p-4 text-center ${isDragActive ? 'bg-light' : ''}`}
                        style={{ borderStyle: isDragActive ? 'solid' : 'dashed' }}
                    >
                        <input {...getInputProps()} />
                        {preview ? (
                            <div>
                                <img 
                                    src={preview} 
                                    alt="Vista previa" 
                                    className="img-thumbnail mb-2" 
                                    style={{ maxHeight: '200px' }}
                                />
                                <p>{file.name}</p>
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                        setPreview('');
                                    }}
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-2">
                                    {isDragActive ? 
                                        'Suelta la imagen aquí' : 
                                        'Arrastra una imagen aquí o haz clic para seleccionar'}
                                </p>
                                <p className="text-muted small">
                                    Formatos aceptados: JPEG, JPG, PNG, GIF
                                </p>
                            </div>
                        )}
                    </div>
                    {uploading && (
                        <div className="mt-2 text-primary">
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            Subiendo imagen...
                        </div>
                    )}
                </div>
                
                {/* Lista de destinatarios */}
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
                
                {/* Botón de envío */}
                <div className="d-flex justify-content-between mt-4">
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate('/')}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Enviando...
                            </>
                        ) : 'Enviar Mensaje'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateMessage;