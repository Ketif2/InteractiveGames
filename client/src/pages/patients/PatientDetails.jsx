import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patientService from '@/services/patientService';
import therapistService from '@/services/therapistService';
import ViewDocumentModal from './ViewDocumentModal';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  // Añade este estado para los terapeutas
  const [therapists, setTherapists] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    sexo: '',
    diagnostico: '',
    id_terapeuta: ''
  });

  const fetchPatientDetails = async () => {
    try {
      const data = await patientService.getPatientById(id);
      setPatient(data);
      setFormData({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        fecha_nacimiento: data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : '',
        sexo: data.sexo || '',
        diagnostico: data.diagnostico || '',
        id_terapeuta: data.id_terapeuta || ''
      });
      
      // Procesar documentos si existen
      if (data.documentos) {
        const docs = typeof data.documentos === 'string' 
          ? JSON.parse(data.documentos) 
          : data.documentos;
        setDocuments(Array.isArray(docs) ? docs : []);
      }
      
      if (data.id_terapeuta) {
        const therapistData = await therapistService.getTherapistById(data.id_terapeuta);
        setTherapist(therapistData);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los detalles del paciente');
    } finally {
      setLoading(false);
    }
  };

  const fetchTherapists = async () => {
    try {
      const data = await therapistService.getAllTherapists();
      setTherapists(data);
    } catch (err) {
      console.error('Error al cargar terapeutas:', err);
      setError('Error al cargar la lista de terapeutas');
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await patientService.deletePatient(patientToDelete);
      setShowDeleteModal(false);
      setPatientToDelete(null);
      setError(null);
      // Navegar de vuelta a la lista después de eliminar
      navigate('/patients');
    } catch (err) {
      setError(err.message || 'Error al eliminar paciente');
      console.error('Error deleting patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async () => {
    try {
      setLoading(true);
      setCurrentId(patient.id_paciente);
      await fetchTherapists(); // Carga los terapeutas antes de abrir el modal
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al preparar la edición');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Usa el servicio específico para asignar terapeuta en lugar de actualizar todo el paciente
      await patientService.assignTherapist(currentId, formData.id_terapeuta);
      setIsModalOpen(false);
      // Recargar datos del paciente para mostrar el cambio
      fetchPatientDetails();
      setError(null);
    } catch (err) {
      console.error('Error al actualizar terapeuta:', err);
      setError('Error al actualizar el terapeuta');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('document', file);
        await patientService.uploadDocument(patient.id_paciente, formData);
        fetchPatientDetails();
        setError(null);
      } catch (error) {
        console.error('Error uploading document:', error);
        setError('Error al subir el documento');
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Ajusta la edad si todavía no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setShowDocumentModal(true);
  };

  const handleDownloadDocument = async (document) => {
    try {
      setLoading(true);
      const response = await patientService.getDocument(
        patient.id_paciente, 
        document.id
      );
      
      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.nombre); 
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Error al descargar el documento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      setLoading(true);
      await patientService.deleteDocument(patient.id_paciente, documentId);
      fetchPatientDetails();
      setError(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Error al eliminar el documento');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00398A]"></div>
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full">
        <div className="text-red-500 text-center p-4 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate('/patients')}
            className="mt-6 px-4 py-2 bg-[#00398A] text-white rounded hover:bg-[#002A66] transition-colors"
          >
            Volver a la lista de pacientes
          </button>
        </div>
      </div>
    </div>
  );
  
  if (!patient) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb y acciones */}
        <div className="flex justify-between items-center mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button 
                  onClick={() => navigate('/patients')}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-[#00398A]"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Pacientes
                </button>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2">{patient.nombre} {patient.apellido}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
  
        {/* Tarjeta principal */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          {/* Cabecera del perfil */}
          <div className="bg-gradient-to-r from-[#00398A] to-[#0052CC] px-6 py-4">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-[#00398A] flex items-center justify-center text-[#00398A] text-2xl font-bold shadow-md">
                {patient.sexo === 'Masculino' ? (
                  <img 
                    src="/src/assets/icons/old-man.png" 
                    alt="Avatar masculino" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img 
                    src="/src/assets/icons/old-woman.png" 
                    alt="Avatar femenino" 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="ml-4 text-white">
                <h1 className="text-2xl font-bold">{patient.nombre} {patient.apellido}</h1>
                <div className="flex items-center mt-1 text-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <span className="text-sm">Paciente</span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Panel de pestañas */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button className="border-[#00398A] text-[#00398A] whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm">
                Información General
              </button>
            </nav>
          </div>
  
          {/* Contenido principal - sistema de grid de dos columnas */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna 1 - Información personal */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Información Personal</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.nombre} {patient.apellido}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fecha de nacimiento</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(patient.fecha_nacimiento)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Edad</dt>
                        <dd className="mt-1 text-sm text-gray-900">{calculateAge(patient.fecha_nacimiento)} años</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Sexo</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patient.sexo}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Diagnóstico</dt>
                        <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-100">
                          {patient.diagnostico || "No se ha registrado un diagnóstico."}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
  
                {/* Sección de Evaluaciones MMSE */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Evaluación MMSE</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Mini-Mental State Examination</p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex flex-col h-full">
                          <div className="text-sm font-medium text-gray-500 mb-2">Evaluación Inicial</div>
                          {patient.evaluacion_inicial !== null ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex-1 flex flex-col items-center justify-center">
                              <div className="text-3xl font-bold text-blue-600">{patient.evaluacion_inicial}</div>
                              <div className="text-sm text-blue-600">/ 30 puntos</div>
                              <div className="w-full bg-blue-100 rounded-full h-2.5 mt-2">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${(patient.evaluacion_inicial / 30) * 100}%` }}>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 flex flex-col items-center justify-center">
                              <div className="text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">No registrada</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex flex-col h-full">
                          <div className="text-sm font-medium text-gray-500 mb-2">Evaluación Final</div>
                          {patient.evaluacion_final !== null ? (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex-1 flex flex-col items-center justify-center">
                              <div className="text-3xl font-bold text-green-600">{patient.evaluacion_final}</div>
                              <div className="text-sm text-green-600">/ 30 puntos</div>
                              <div className="w-full bg-green-100 rounded-full h-2.5 mt-2">
                                <div 
                                  className="bg-green-600 h-2.5 rounded-full" 
                                  style={{ width: `${(patient.evaluacion_final / 30) * 100}%` }}>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex-1 flex flex-col items-center justify-center">
                              <div className="text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">No registrada</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {patient.evaluacion_inicial !== null && patient.evaluacion_final !== null && (
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex flex-col h-full">
                            <div className="text-sm font-medium text-gray-500 mb-2">Progreso</div>
                            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex-1 flex flex-col items-center justify-center">
                              <div className="text-3xl font-bold text-purple-600">
                                {patient.evaluacion_final - patient.evaluacion_inicial > 0 ? '+' : ''}
                                {patient.evaluacion_final - patient.evaluacion_inicial}
                              </div>
                              <div className="text-sm text-purple-600">puntos</div>
                              <div className="flex items-center mt-2">
                                <div className="text-sm font-medium text-purple-500">
                                  {patient.evaluacion_final > patient.evaluacion_inicial ? 'Mejora' : 
                                   patient.evaluacion_final < patient.evaluacion_inicial ? 'Retroceso' : 'Sin cambios'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Columna 2 - Info del terapeuta y sesiones */}
              <div className="space-y-6">
                {/* Terapeuta asignado */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Psicorehabilitador Asignado</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    {therapist ? (
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-[#00398A] flex items-center justify-center text-white font-bold text-lg">
                          {therapist.nombre.charAt(0)}{therapist.apellido.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{therapist.nombre} {therapist.apellido}</div>
                          <button onClick={handleEditClick} className="mt-1 text-xs text-[#00A8E3] hover:text-[#0085b3]">
                            Cambiar psicorehabilitador
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-gray-500 text-sm">No hay psicorehabilitador asignado</p>
                        <button 
                          className="mt-2 text-sm text-[#00A8E3] hover:text-[#0085b3] font-medium"
                          onClick={handleEditClick}
                        >
                          Asignar psicorehabilitador
                        </button>
                      </div>
                    )}
                  </div>
                </div>
  
                {/* Resumen de sesiones */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Sesiones</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{patient.num_sesiones || 0}</div>
                      <p className="text-sm text-gray-500 mt-1">Sesiones totales</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(new Date())}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Documentos */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Documentos del Paciente</h2>
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="inline-flex items-center px-4 py-2 bg-[#00A8E3] text-white rounded-md text-sm font-medium hover:bg-[#0085b3] cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Subir Documento
              </label>
            </div>
          </div>
  
          <div className="p-6">
            {documents && documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow group">
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="rounded-md bg-blue-50 p-2 mr-3">
                          {doc.nombre.toLowerCase().endsWith('.pdf') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ) : doc.nombre.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" title={doc.nombre}>
                            {doc.nombre}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(doc.fecha_subida)}
                          </p>
                        </div>
                      </div>
                    </div>
  
                    {/* Botones de acción */}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
                      <button 
                        onClick={() => handleViewDocument(doc)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Ver
                      </button>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No hay documentos disponibles</h3>
                <p className="text-gray-500 mb-4">Sube el primer documento para este paciente</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileInputEmpty"
                />
                <label
                  htmlFor="fileInputEmpty"
                  className="inline-flex items-center px-4 py-2 bg-[#00A8E3] text-white rounded-md text-sm font-medium hover:bg-[#0085b3] cursor-pointer transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Subir Documento
                </label>
              </div>
            )}
          </div>
        </div>
  
        {/* Modal de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md mx-auto shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Confirmar Eliminación
                </h3>
                <p className="text-gray-600 mb-6">
                  ¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPatientToDelete(null);
                    }}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto py-10">
          <div className="bg-white p-6 rounded-lg max-w-md mx-auto shadow-xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#00398A] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Cambiar Psicorehabilitador
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Psicorehabilitador asignado:</label>
                <div className="relative">
                  <select
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] transition-colors pl-10"
                    value={formData.id_terapeuta}
                    onChange={(e) => setFormData({...formData, id_terapeuta: e.target.value})}
                    required
                  >
                    <option value="">Seleccione un terapeuta</option>
                    {Array.isArray(therapists) && therapists.map((therapist) => (
                      <option 
                        key={therapist.id_terapeuta} 
                        value={therapist.id_terapeuta}
                      >
                        {`${therapist.nombre} ${therapist.apellido}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  El psicorehabilitador asignado será responsable de las sesiones con este paciente
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-5 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A8E3] hover:bg-[#0088b3] text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A8E3] shadow-sm transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal para visualizar documentos */}
      {showDocumentModal && selectedDocument && (
        <ViewDocumentModal 
          document={selectedDocument}
          patientId={patient.id_paciente}
          onClose={() => {
            setShowDocumentModal(false);
            setSelectedDocument(null);
          }}
        />
      )}
      
      {/* Indicador de carga */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A8E3]"></div>
              <p className="text-[#00398A] font-medium">Procesando...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default PatientDetails;