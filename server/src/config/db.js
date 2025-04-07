import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Configura con los parámetros de Azure SQL Server
const config = {
    server: process.env.DB_HOST || 'tesis-server.database.windows.net',
    user: process.env.DB_USER || 'adminsql',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'juegos',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: true, // Requerido para Azure
        trustServerCertificate: false
    }
};

// Creamos un objeto pool personalizado con la interfaz que necesitas
const customPool = {
    _pool: null,
    
    // Inicializar la conexión real a SQL Server
    async _initialize() {
        if (!this._pool) {
            try {
                this._pool = await new sql.ConnectionPool(config).connect();
                console.log('✅ Conexión exitosa a la base de datos Azure SQL');
            } catch (error) {
                console.error('❌ Error al conectar con la base de datos:', error.message);
                throw error;
            }
        }
        return this._pool;
    },
    
    // Método para envolver cualquier consulta SQL y formatear la respuesta igual que MySQL
    async _executeQuery(query, params = []) {
        await this._initialize();
        const request = this._pool.request();
        
        // Adaptar los parámetros si existen
        if (params && params.length) {
            params.forEach((param, index) => {
                request.input(`param${index}`, param);
            });
            
            // Reemplazar ? por @paramX para compatibilidad con SQL Server
            let modifiedQuery = query;
            for (let i = 0; i < params.length; i++) {
                modifiedQuery = modifiedQuery.replace('?', `@param${i}`);
            }
            query = modifiedQuery;
        }
        
        // Ejecutar la consulta
        const result = await request.query(query);
        
        // Resultado formateado como MySQL
        const mysqlStyleResult = {
            // Siempre devolvemos recordset como rows
            rows: result.recordset || [],
            // Para consultas INSERT, simular insertId
            insertId: undefined,
            // Para UPDATE/DELETE, simular affectedRows
            affectedRows: result.rowsAffected ? result.rowsAffected[0] : 0,
            // Añadir más propiedades de MySQL si es necesario
            changedRows: result.rowsAffected ? result.rowsAffected[0] : 0
        };
        
        // Si es una inserción (INSERT), intentamos obtener el ID
        if (query.trim().toUpperCase().startsWith('INSERT')) {
            try {
                // Si la tabla tiene una columna de identidad, podemos obtener el ID insertado
                // Modificar la consulta para capturar el último ID insertado
                const idQuery = "SELECT SCOPE_IDENTITY() AS insertId";
                const idResult = await request.query(idQuery);
                if (idResult && idResult.recordset && idResult.recordset[0]) {
                    mysqlStyleResult.insertId = idResult.recordset[0].insertId;
                }
            } catch (idError) {
                console.error('Error al obtener insertId:', idError);
                // Si falla, dejamos insertId como undefined
            }
        }
        
        return mysqlStyleResult;
    },
    
    // Query es el método principal que todos los controladores usan
    async query(query, params) {
        const result = await this._executeQuery(query, params);
        return [result.rows, result]; // Formato como MySQL: [rows, fields]
    },
    
    // Método compatible con mysql2
    async getConnection() {
        await this._initialize();
        
        // Devuelve un objeto similar al de mysql2 pero adaptado para mssql
        return {
            query: async (query, params) => {
                const result = await customPool._executeQuery(query, params);
                return [result.rows, result];
            },
            execute: async (query, params) => {
                const result = await customPool._executeQuery(query, params);
                return [result.rows, result];
            },
            release: () => {
                // No es necesario liberar la conexión en mssql como en mysql
                return;
            }
        };
    },
    
    // Método compatible con mysql2
    async execute(query, params) {
        const result = await this._executeQuery(query, params);
        return [result.rows, result];
    }
};

// Verifica la conexión en el inicio
(async () => {
    try {
        const connection = await customPool.getConnection();
        console.log('✅ Conexión verificada a la base de datos Azure SQL');
        connection.release();
    } catch (error) {
        console.error('❌ Error al verificar la conexión con la base de datos:', error.message);
        // No terminamos el proceso para permitir reintento de conexión más tarde
    }
})();

export default customPool;