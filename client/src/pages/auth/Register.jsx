// pages/auth/Register.jsx
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D7D7D7]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <RegisterForm />
        
        <div className="text-center mt-4">
          <Link 
            to="/login"
            className="text-[#00A8E3] hover:text-[#7EC3E2]"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;