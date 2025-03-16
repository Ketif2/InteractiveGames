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

  const handleEditClick = () => {
    setCurrentId(patient.id_paciente);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await patientService.updatePatient(currentId, formData);
      setIsModalOpen(false);
      fetchPatientDetails();
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al actualizar paciente');
      console.error('Error updating patient:', err);
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
    <div className="min-h-screen bg-[#D7D7D7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex" aria-label="Breadcrumb">
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
                <span className="ml-1 text-sm font-medium text-gray-700">{patient.nombre} {patient.apellido}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header con acciones */}
          <div className="p-6 bg-gradient-to-r from-[#00398A] to-[#0052cc] text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{patient.nombre} {patient.apellido}</h1>
              <p className="text-blue-100 mt-1">ID: {patient.id_paciente}</p>
            </div>
          </div>

          {/* Contenido principal - Información del paciente */}
          <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda - Información Personal */}
          <div className="bg-white rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Información Personal</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                  <p className="mt-1 text-base text-gray-900">{patient.nombre} {patient.apellido}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de nacimiento</p>
                  <p className="mt-1 text-base text-gray-900">{formatDate(patient.fecha_nacimiento)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sexo</p>
                  <p className="mt-1 text-base text-gray-900">{patient.sexo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Edad</p>
                  <p className="mt-1 text-base text-gray-900">{calculateAge(patient.fecha_nacimiento)} años</p>
                </div>
              </div>
              {/* Información Adicional - Placeholder */}
              <div className="bg-white rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Información Adicional</h2>
                <div>
                  <p className="text-sm font-medium text-gray-500">Diagnóstico</p>
                  <p className="mt-1 text-base text-gray-900 bg-gray-50 p-3 rounded-md">
                    {patient.diagnostico || "No se ha registrado un diagnóstico."}
                  </p>
                </div>
              </div>
            </div>
          </div>

              {/* Columna Derecha - Terapeuta e Información Adicional */}
              <div>
                {/* Terapeuta Asignado */}
                <div className="bg-white rounded-lg mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Terapeuta Asignado</h2>
                  <div className="p-4 bg-gray-50 rounded-lg mb-2">
                    {therapist ? (
                      <div className="flex items-center">
                        <div className="bg-[#00398A] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-lg">
                          {therapist.nombre.charAt(0)}{therapist.apellido.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-semibold">{therapist.nombre} {therapist.apellido}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-gray-500">No hay terapeuta asignado</p>
                        <button 
                          className="mt-2 text-sm text-[#00A8E3] hover:text-[#0085b3] font-medium"
                          onClick={handleEditClick}
                        >
                          Asignar terapeuta
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Número de Sesiones</p>
                    <p className="mt-1 text-base text-gray-900">{patient.num_sesiones}</p>
                  </div>
                </div>
                {/* Nueva sección para Evaluaciones y Sesiones */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Evaluación MMSE</h3>
                  <div className="flex space-x-4">
                    {patient.evaluacion_inicial !== null ? (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Evaluación Inicial</p>
                        <p className="text-lg font-bold text-blue-700">{patient.evaluacion_inicial}/30</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-gray-500">Evaluación Inicial</p>
                        <p className="text-lg font-medium text-gray-400">No registrada</p>
                      </div>
                    )}
                    
                    {patient.evaluacion_final !== null ? (
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Evaluación Final</p>
                        <p className="text-lg font-bold text-green-700">{patient.evaluacion_final}/30</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-sm text-gray-500">Evaluación Final</p>
                        <p className="text-lg font-medium text-gray-400">No registrada</p>
                      </div>
                    )}
                  </div>
              </div>
            </div>

            {/* Documentos */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Documentos del Paciente</h2>
                <div className="relative">
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

              {documents && documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group">
                      <div className="flex items-start">
                        <div className="rounded-md bg-blue-50 p-2 mr-3">
                          {doc.nombre.toLowerCase().endsWith('.pdf') ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 384 512" fill="currentColor">
                              <path d="M181.9 256.1c-5.1-9.5-17.6-12.8-27.2-7.6-9.4 5-12.8 17.9-7.8 27.4 16.9 31.3 25.6 67.1 25.6 104.3 0 11.9 9.7 21.4 21.6 21.4h.2c11.9 0 21.4-9.9 21.4-21.8 0-42.8-10.5-84.1-30.6-120.4 0-.1 0-.1-.1-.2-.1-.1-.1-.1-.1-.1z"/>
                              <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm107.7 245.9C122.8 288.6 160 326.7 160 384c0 0 0 .6 0 .6V448c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32V384.1c-.5-29.6 11.8-58.2 32.3-79.3 18.5-18.9 29-45.5 29-73.1 0-58.3-44.5-106-101.4-110.9l-9.5-.8c-17.5-1.5-30.1-17.2-28.6-34.7s17.2-30.1 34.7-28.6l9.5 .8C107.1 74.3 176 139.4 176 232c0 38.6-15.3 73.8-41.9 100.4l-4.4 4.4 0 0c-6.3 6.3-10 14.7-10 24v1c0 17.7-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32v-1c0-9 3.6-17.5 9.9-23.9l4.1-4.1z"/>
                            </svg>
                          ) : doc.nombre.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
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

                      {/* Acciones sobre el documento */}
                      <div className="mt-3 pt-2 border-t flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewDocument(doc)}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Ver"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDownloadDocument(doc)}
                          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                          title="Descargar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
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
        </div>

        {/* Modal de Visualización de Documento */}
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
      </div>
    </div>
  );
};

export default PatientDetails;