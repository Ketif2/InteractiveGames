import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar multer para almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const patientId = req.params.id;
    const dir = `./uploads/patients/${patientId}`;
    
    // Crear directorio si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Crear nombre único con marca de tiempo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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

export default {
  upload,
  deleteFile,
  getMimeType,
  fileExists
};