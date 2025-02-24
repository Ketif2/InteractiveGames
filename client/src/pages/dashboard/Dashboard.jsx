// pages/dashboard/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Patients from '../../assets/icons/patient-icon.svg';
import NewSession from '../../assets/icons/new-session.svg';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-[#00398A] mb-8 ">Dashboard</h1>
      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Link 
          to="/patients"
          className="flex flex-col items-center p-6 bg-[#7EC3E2] rounded-lg hover:bg-[#00A8E3] transition-all"
        >
          <img 
            src={Patients}
            alt="Pacientes" 
            className="w-24 h-24 mb-4"
          />
          <span className="text-lg font-medium">Pacientes</span>
        </Link>

        <Link 
          to="/new-session"
          className="flex flex-col items-center p-6 bg-[#7EC3E2] rounded-lg hover:bg-[#00A8E3] transition-all"
        >
          <img 
            src={NewSession}
            alt="Nueva Sesión" 
            className="w-24 h-24 mb-4"
          />
          <span className="text-lg font-medium">Nueva Sesión</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;