// pages/sessions/NewSession.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';

// Datos quemados mientras implementamos el backend
const MOCK_PATIENTS = [
 { id: 1, nombre: "Kevin Revelo", status: "Pendiente", sesiones: "6/8" },
 { id: 2, nombre: "Ricardo Becerra", status: "Hecho", sesiones: "4/8" },
 { id: 3, nombre: "Jefferson Pistala", status: "Pendiente", sesiones: "8/8" },
 { id: 4, nombre: "Joel Guingla", status: "Pendiente", sesiones: "8/8" },
 { id: 5, nombre: "David Delgado", status: "Pendiente", sesiones: "6/8" },
 { id: 6, nombre: "Alexander Flores", status: "Hecho", sesiones: "6/8" }
];

const NewSession = () => {
 const [sessions, setSessions] = useState(MOCK_PATIENTS);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // Cuando implementemos el backend, usaremos este useEffect
 /*useEffect(() => {
   const fetchSessions = async () => {
     setLoading(true);
     try {
       const data = await sessionService.getAllSessions();
       setSessions(data);
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   fetchSessions();
 }, []);*/

 if (loading) return (
   <div className="flex justify-center items-center h-screen">
     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00398A]"></div>
   </div>
 );

 if (error) return (
   <div className="text-red-500 text-center p-4">
     Error: {error}
   </div>
 );

 return (
   <div className="container mx-auto px-4 py-6">
     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               ID
             </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Nombres
             </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Sesiones
             </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Status
             </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Juego
             </th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
           {sessions.map((session) => (
             <tr key={session.id}>
               <td className="px-6 py-4 whitespace-nowrap">
                 {session.id}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 {session.nombre}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 {session.sesiones}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                   session.status === "Pendiente" 
                     ? "bg-red-100 text-red-800" 
                     : "bg-green-100 text-green-800"
                 }`}>
                   {session.status}
                 </span>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 {session.status === "Pendiente" ? (
                   <Link
                     to={`/games/${session.id}`}
                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#7EC3E2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00398A]"
                   >
                     Jugar
                   </Link>
                 ) : (
                   <Link
                     to={`/sessions/${session.id}/stats`}
                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7EC3E2] hover:bg-[#00A8E3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00398A]"
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