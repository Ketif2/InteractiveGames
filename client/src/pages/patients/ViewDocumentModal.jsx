import { useState, useEffect } from 'react';
import patientService from '@/services/patientService';

const ViewDocumentModal = ({ document, patientId, onClose }) => {
  const [documentUrl, setDocumentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        console.log('Cargando documento:', document.id, 'Intento:', retryCount + 1);
        
        const response = await patientService.getDocument(patientId, document.id);
        console.log('Respuesta recibida:', response);
        
        // Verificar si la respuesta tiene data y contenido
        if (!response || !response.data) {
          console.error('Respuesta sin datos:', response);
          throw new Error('Respuesta vacía del servidor');
        }
        
        // Comprobar si hay datos y tamaño
        if (response.data.size === 0) {
          console.error('Blob vacío recibido');
          throw new Error('Documento vacío recibido del servidor');
        }
        
        // Crear URL para el blob recibido usando un tipo específico
        const mimeType = getMimeType(document.tipo);
        const blob = new Blob([response.data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        
        console.log('URL creada:', url, 'Tamaño del blob:', blob.size);
        setDocumentUrl(url);
        setError(null);
      } catch (err) {
        console.error('Error cargando documento:', err);
        setError(`No se pudo cargar el documento: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
    
    // Limpiar URL al desmontar
    return () => {
      if (documentUrl) {
        window.URL.revokeObjectURL(documentUrl);
      }
    };
  }, [document.id, patientId, retryCount]);

  // Helper para obtener el tipo MIME correcto
  const getMimeType = (fileType) => {
    const type = fileType.toLowerCase();
    if (type === 'pdf' || document.nombre.toLowerCase().endsWith('.pdf')) return 'application/pdf';
    if (['jpg', 'jpeg'].includes(type) || document.nombre.toLowerCase().match(/\.(jpg|jpeg)$/)) return 'image/jpeg';
    if (type === 'png' || document.nombre.toLowerCase().endsWith('.png')) return 'image/png';
    if (type === 'doc' || document.nombre.toLowerCase().endsWith('.doc')) return 'application/msword';
    if (type === 'docx' || document.nombre.toLowerCase().endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    return 'application/octet-stream';
  };

  const handleDownload = async () => {
    if (documentUrl) {
      // Si ya tenemos la URL, usarla para descargar
      const link = document.createElement('a');
      link.href = documentUrl;
      link.setAttribute('download', document.nombre); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Intento alternativo de descarga directa si la visualización falló
      try {
        setLoading(true);
        const response = await patientService.getDocument(patientId, document.id);
        
        if (!response || !response.data) {
          throw new Error('No se pudo obtener el archivo');
        }
        
        const mimeType = getMimeType(document.tipo);
        const blob = new Blob([response.data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', document.nombre);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        setError(null);
      } catch (err) {
        console.error('Error en descarga alternativa:', err);
        setError(`No se pudo descargar el documento: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Determinar si es un PDF por el nombre en lugar de confiar solo en el tipo
  const isPdf = () => {
    return document.nombre.toLowerCase().endsWith('.pdf') || document.tipo.toLowerCase() === 'pdf';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-4/5 h-4/5 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{document.nombre}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 bg-gray-100 overflow-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A]"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <p>{error}</p>
              <div className="mt-4 flex space-x-4">
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 bg-[#00398A] text-white rounded hover:bg-[#002A66]"
                >
                  Reintentar Carga
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-4 py-2 bg-[#00A8E3] text-white rounded hover:bg-[#7EC3E2]"
                >
                  Intentar Descargar
                </button>
              </div>
            </div>
          ) : isPdf() ? (
            // Método más compatible para renderizar PDFs
            <div className="h-full w-full flex items-center justify-center">
              <iframe 
                src={documentUrl}
                type="application/pdf"
                width="100%" 
                height="100%"
                className="w-full h-full"
              >
                <p>
                  Este navegador no soporta PDFs. Por favor
                  <a href={documentUrl} target="_blank" rel="noopener noreferrer">descarga el PDF</a>
                  para verlo.
                </p>
              </iframe>
            </div>
          ) : ['jpg', 'jpeg', 'png'].includes(document.tipo.toLowerCase()) || 
             document.nombre.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? (
            <div className="flex items-center justify-center h-full">
              <img 
                src={documentUrl}
                alt={document.nombre}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p>Vista previa no disponible para este tipo de archivo.</p>
              <button 
                onClick={handleDownload}
                className="mt-4 px-4 py-2 bg-[#00A8E3] text-white rounded hover:bg-[#7EC3E2]"
              >
                Descargar Archivo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentModal;