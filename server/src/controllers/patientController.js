import pool from '../config/db.js';
import { upload } from '../utils/fileManager.js'; // Importa el middleware de carga de archivos
import path from 'path';
import fs from 'fs';

// Obtener todos los pacientes
export const getPacientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM paciente');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener un paciente por ID
export const getPacienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const [patients] = await pool.query(
            'SELECT * FROM paciente WHERE id_paciente = ?',
            [id]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json(patients[0]);
    } catch (error) {
        console.error('Error al obtener paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crear un nuevo paciente
export const createPaciente = async (req, res) => {
    const { 
        id_terapeuta,
        nombre, 
        apellido, 
        fecha_nacimiento,
        sexo, 
        diagnostico, 
        documentos 
    } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO paciente (
                id_terapeuta, nombre, apellido, 
                fecha_nacimiento, sexo, diagnostico, documentos
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id_terapeuta, nombre, apellido, 
                fecha_nacimiento, sexo, diagnostico, 
                documentos ? JSON.stringify(documentos) : null
            ]
        );

        res.status(201).json({
            message: 'Paciente creado exitosamente',
            pacienteId: result.insertId
        });
    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar un paciente por ID
export const updatePaciente = async (req, res) => {
    const { id } = req.params;
    const { id_terapeuta, nombre, apellido, fecha_nacimiento, diagnostico } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE paciente SET id_terapeuta = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, diagnostico = ? WHERE id_paciente = ?',
            [id_terapeuta, nombre, apellido, fecha_nacimiento, diagnostico, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente actualizado' });
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar un paciente por ID
export const deletePaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM paciente WHERE id_paciente = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente eliminado' });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const assignTherapist = async (req, res) => {
    try {
        const { id_paciente } = req.params;
        const { id_terapeuta } = req.body;

        // Verificar que el paciente existe
        const [patient] = await pool.query(
            'SELECT * FROM paciente WHERE id_paciente = ?',
            [id_paciente]
        );

        if (patient.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Verificar que el terapeuta existe
        const [therapist] = await pool.query(
            'SELECT * FROM terapeuta WHERE id_terapeuta = ?',
            [id_terapeuta]
        );

        if (therapist.length === 0) {
            return res.status(404).json({ message: 'Terapeuta no encontrado' });
        }

        // Asignar terapeuta al paciente
        const [result] = await pool.query(
            'UPDATE paciente SET id_terapeuta = ? WHERE id_paciente = ?',
            [id_terapeuta, id_paciente]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se pudo asignar el terapeuta' });
        }

        res.json({ 
            message: 'Terapeuta asignado exitosamente',
            id_paciente,
            id_terapeuta
        });
    } catch (error) {
        console.error('Error al asignar terapeuta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


// Subir documento para un paciente
export const uploadDocument = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si el paciente existe
      const [patient] = await pool.query(
        'SELECT * FROM paciente WHERE id_paciente = ?', [id]
      );
      
      if (patient.length === 0) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
      
      // Carga de archivo único usando middleware multer
      upload.single('document')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }
        
        // Obtener documentos actuales o inicializar array vacío
        const currentDocuments = typeof patient[0].documentos === 'string' 
        ? JSON.parse(patient[0].documentos) 
        : (patient[0].documentos || []);
        
        // Añadir nuevo documento al array
        const newDocument = {
          id: Date.now().toString(),
          nombre: req.file.originalname,
          tipo: path.extname(req.file.originalname).substring(1),
          ruta: req.file.path,
          fecha_subida: new Date().toISOString()
        };
        
        currentDocuments.push(newDocument);
        
        // Actualizar registro del paciente con nuevo array de documentos
        await pool.query(
          'UPDATE paciente SET documentos = ? WHERE id_paciente = ?',
          [JSON.stringify(currentDocuments), id]
        );
        
        res.status(201).json({
          message: 'Documento subido exitosamente',
          document: newDocument
        });
      });
    } catch (error) {
      console.error('Error al subir documento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  
  // Obtener todos los documentos de un paciente
  export const getDocuments = async (req, res) => {
    try {
      const { id } = req.params;
      
      const [patient] = await pool.query(
        'SELECT documentos FROM paciente WHERE id_paciente = ?', [id]
      );
      
      if (patient.length === 0) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
      
      const documents = JSON.parse(patient[0].documentos || '[]');
      res.json(documents);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  
// Obtener documento específico de un paciente
export const getDocument = async (req, res) => {
  try {
    const { id, documentId } = req.params;
    
    // Obtener documentos del paciente
    const [patient] = await pool.query(
      'SELECT documentos FROM paciente WHERE id_paciente = ?', [id]
    );
    
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    // Verificar si documentos es un string o un objeto
    let documents;
    try {
      documents = typeof patient[0].documentos === 'string' 
        ? JSON.parse(patient[0].documentos) 
        : (patient[0].documentos || []);
    } catch (err) {
      console.error('Error al procesar documentos:', err);
      return res.status(500).json({ message: 'Error al procesar documentos' });
    }
    
    const document = Array.isArray(documents) 
      ? documents.find(doc => doc.id === documentId)
      : null;
    
    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }
    
    // Verificar que el archivo existe físicamente
    const filePath = path.resolve(document.ruta);
    if (!fs.existsSync(filePath)) {
      console.error(`Archivo no encontrado en ruta: ${filePath}`);
      return res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
    }
    
    // Para debuggear: Verificar tamaño y propiedades del archivo
    const stats = fs.statSync(filePath);
    console.log(`Enviando archivo: ${filePath}, Tamaño: ${stats.size} bytes`);
    
    // Obtener el tipo MIME correcto basado en la extensión
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Configurar headers HTTP críticos
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(document.nombre)}"`);
    
    // Importante: Desactivar cualquier compresión que pueda interferir con binarios
    res.setHeader('Content-Encoding', 'identity');
    
    // Desactivar cache para desarrollo
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Leer el archivo completo y enviarlo directamente en lugar de usar pipe
    // Esto puede ser útil para archivos pequeños y evitar problemas de streaming
    const fileContent = fs.readFileSync(filePath);
    res.send(fileContent);
    
  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
  
  // Eliminar documento
  export const deleteDocument = async (req, res) => {
    try {
      const { id, documentId } = req.params;
      
      // Obtener documentos del paciente
      const [patient] = await pool.query(
        'SELECT documentos FROM paciente WHERE id_paciente = ?', [id]
      );
      
      if (patient.length === 0) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
      
      // Verificar si documentos es un string o un objeto
      const documents = typeof patient[0].documentos === 'string' 
        ? JSON.parse(patient[0].documentos) 
        : (patient[0].documentos || []);
      
      const documentIndex = documents.findIndex(doc => doc.id === documentId);
      
      if (documentIndex === -1) {
        return res.status(404).json({ message: 'Documento no encontrado' });
      }
      
      // Eliminar archivo del sistema de archivos
      const documentPath = documents[documentIndex].ruta;
      fs.unlinkSync(documentPath);
      
      // Eliminar documento del array
      documents.splice(documentIndex, 1);
      
      // Actualizar registro del paciente
      await pool.query(
        'UPDATE paciente SET documentos = ? WHERE id_paciente = ?',
        [JSON.stringify(documents), id]
      );
      
      res.json({ message: 'Documento eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
export default {
    getPacientes, 
    getPacienteById, 
    createPaciente, 
    updatePaciente, 
    deletePaciente, 
    assignTherapist,
    uploadDocument,
    getDocument,
    deleteDocument,
    getDocuments
};