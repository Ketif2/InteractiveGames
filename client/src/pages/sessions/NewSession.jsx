// pages/sessions/NewSession.jsx
import { Link } from 'react-router-dom';

const MOCK_PATIENTS = [
  { id: 1, nombre: "Kevin Revelo", status: "Pendiente" },
  { id: 2, nombre: "Ricardo Becerra", status: "Hecho" },
  { id: 3, nombre: "Jefferson Pistala", status: "Pendiente" },
  { id: 4, nombre: "Joel Guingla", status: "Pendiente" },
  { id: 5, nombre: "David Delgado", status: "Pendiente" },
  { id: 6, nombre: "Alexander Flores", status: "Hecho" }
];

const NewSession = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow p-6">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombres
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Juego
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_PATIENTS.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    patient.status === "Pendiente" 
                      ? "bg-red-100 text-red-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.status === "Pendiente" ? (
                    <Link
                      to={`/games/${patient.id}`}
                      className="bg-[#00A8E3] text-white px-4 py-2 rounded-md hover:bg-[#7EC3E2]"
                    >
                      Jugar
                    </Link>
                  ) : (
                    <Link
                      to={`/sessions/${patient.id}/stats`}
                      className="bg-[#7EC3E2] text-white px-4 py-2 rounded-md hover:bg-[#00A8E3]"
                    >
                      Estadísticas
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewSession;