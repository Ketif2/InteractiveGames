// pages/auth/Login.jsx
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';  

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D7D7D7]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          {/* 
          <img
            className="mx-auto h-12 w-auto"
            src="/src/assets/icons/brainLogo.svg"
            alt="Recuerda+"
          />
          */}
          <h2 className="mt-6 text-center text-3xl font-bold text-[#00398A]">
            Iniciar Sesión
          </h2>
        </div>
        
        <LoginForm />

        <div className="text-center mt-4">
          <Link 
            to="/register"
            className="text-[#00A8E3] hover:text-[#7EC3E2]"
          >
            ¿No tienes una cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;