// pages/auth/Register.jsx
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#f0f7ff] to-[#e6f0fa] p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#00398A] py-6 px-8 text-center">
          <img
            className="mx-auto h-16 w-auto"
            src="/src/assets/icons/logoApp.svg"
            alt="Recuerda+"
          />
          <h2 className="mt-3 text-3xl font-bold text-white">
            Recuerda+
          </h2>
          <p className="mt-1 text-blue-100">
            Plataforma de rehabilitación cognitiva
          </p>
        </div>
        
        <div className="p-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-medium text-gray-800">Crear una cuenta</h3>
            <p className="text-sm text-gray-600 mt-1">
              Completa la información con tus datos
            </p>
          </div>
          
          <RegisterForm />
          
          <div className="text-center mt-8 text-sm">
            <Link 
              to="/login"
              className="text-[#00A8E3] hover:text-[#0085b3] font-medium transition-colors"
            >
              ¿Ya tiene credenciales? <span className="underline">Iniciar sesión</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-xs">
        <p>© {new Date().getFullYear()} Recuerda+ | Plataforma de Rehabilitación Cognitiva</p>
      </div>
    </div>
  );
};

export default Register;