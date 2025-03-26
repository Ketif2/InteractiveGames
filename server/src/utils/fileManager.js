import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Función para obtener la carpeta Documentos de Windows
const getDocumentsFolder = () => {
  return path.join(os.homedir(), 'Documents/Pacientes');
};

// Configurar multer para almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Verificar si los parámetros existen, de lo contrario usar valores predeterminados
    const patientNombre = req.params.nombre || 'PACIENTE';
    const patientApellido = req.params.apellido || 'SIN_APELLIDO';
    
    console.log("Parámetros de destino:", { patientNombre, patientApellido, params: req.params });
    
    // Crear directorio con nombre y apellido en la carpeta Documentos
    const documentsFolder = getDocumentsFolder();
    const dir = path.join(documentsFolder, `${patientNombre.toUpperCase()}_${patientApellido.toUpperCase()}`);
    
    console.log("Directorio de destino:", dir);
    
    // Crear directorio si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Obtener la fecha actual formateada (YYYYMMDD)
    const date = new Date();
    const formattedDate = date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2);
    
    // Limpiar el nombre original (quitar espacios y caracteres especiales)
    let originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Quitar extensión
    originalName = originalName.replace(/[^a-zA-Z0-9]/g, "_"); // Reemplazar caracteres especiales
    originalName = originalName.substring(0, 30); // Limitar longitud
    
    // Crear nombre final: fecha + nombre original limpio + extensión
    const fileName = `${formattedDate}_${originalName}${path.extname(file.originalname)}`;
    
    cb(null, fileName);
  }
});

// Crear middleware de carga
export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
  fileFilter: (req, file, cb) => {
    // Aceptar tipos comunes de documentos
    const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, DOC, DOCX, JPG, JPEG o PNG'));
    }
  }
});

// Función para eliminar archivo físicamente
export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error al eliminar archivo:', err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

// Función para obtener el tipo MIME según la extensión del archivo
export const getMimeType = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

// Validar si un archivo existe
export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Obtener ruta del directorio para un paciente específico
export const getPatientDirectory = (nombre, apellido) => {
  const nombreFormatted = nombre || 'PACIENTE';
  const apellidoFormatted = apellido || 'SIN_APELLIDO';
  return path.join(getDocumentsFolder(), `${nombreFormatted.toUpperCase()}_${apellidoFormatted.toUpperCase()}`);
};

export default {
  upload,
  deleteFile,
  getMimeType,
  fileExists,
  getPatientDirectory
};