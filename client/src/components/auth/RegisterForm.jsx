// components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Removemos confirmPassword antes de enviar al servidor
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <img
          className="mx-auto h-12 w-auto"
          src="/src/assets/icons/brainLogo.svg"
          alt="Recuerda+"
        />
        <h2 className="mt-6 text-center text-3xl font-bold text-[#00398A]">
          Registrarse
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <input
            name="nombre"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#00A8E3] focus:border-[#00A8E3] focus:z-10 sm:text-sm"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          <input
            name="apellido"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00A8E3] focus:border-[#00A8E3] focus:z-10 sm:text-sm"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00A8E3] focus:border-[#00A8E3] focus:z-10 sm:text-sm"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#00A8E3] focus:border-[#00A8E3] focus:z-10 sm:text-sm"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#00A8E3] focus:border-[#00A8E3] focus:z-10 sm:text-sm"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00398A] hover:bg-[#00A8E3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A8E3] disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Registrarse'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;