// src/components/sessions/SessionCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({ session }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/stats/session/${session.id_sesion}/details`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-2/3">
          <div>
            <p className="text-sm text-gray-600">ID de sesión</p>
            <p className="font-medium">{session.id_sesion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fecha</p>
            <p className="font-medium">
              {new Date(session.fecha_sesion).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <span 
              className={`px-2 py-1 text-xs rounded-full font-semibold ${
                session.estado === 'Completada' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {session.estado}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-1/3 flex justify-end">
          <button
            onClick={handleViewDetails}
            className={`px-4 py-2 rounded text-white ${
              session.estado === 'Completada'
                ? 'bg-[#00A8E3] hover:bg-[#7EC3E2] transition-colors'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={session.estado !== 'Completada'}
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;