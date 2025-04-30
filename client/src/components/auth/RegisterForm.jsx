import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Eye, EyeOff, AlertCircle, User, Mail, Lock } from 'lucide-react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    institucion: '',
    especialidad: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      navigate('/login', { 
        state: { message: 'Solicitud enviada correctamente. Su acceso será verificado por un administrador.' }
      });
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud de registro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // El ID para el error siempre debe existir en el DOM, incluso cuando no hay error
  const errorId = "register-error-message";
  // ID para la descripción de la contraseña
  const passwordHintId = "password-hint";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="pl-10 py-2 block w-full text-base border border-gray-300 rounded-md shadow-sm focus:ring-[#00398A] focus:border-[#00398A]"
              placeholder="Su nombre"
              onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese su nombre')}
              onInput={(e) => e.target.setCustomValidity('')}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
        </div>

        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="apellido"
              name="apellido"
              type="text"
              required
              value={formData.apellido}
              onChange={handleChange}
              className="pl-10 py-2 block w-full text-base border border-gray-300 rounded-md shadow-sm focus:ring-[#00398A] focus:border-[#00398A]"
              placeholder="Su apellido"
              onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese su apellido')}
              onInput={(e) => e.target.setCustomValidity('')}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="pl-10 py-2 block w-full text-base border border-gray-300 rounded-md shadow-sm focus:ring-[#00398A] focus:border-[#00398A]"
            placeholder="correo@ejemplo.com"
            onInvalid={(e) => {
              if (e.target.validity.valueMissing) {
                e.target.setCustomValidity('Por favor, ingrese su correo electrónico');
              } else if (e.target.validity.typeMismatch) {
                e.target.setCustomValidity('Por favor, ingrese un correo electrónico válido');
              }
            }}
            onInput={(e) => e.target.setCustomValidity('')}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleChange}
            className="pl-10 pr-10 py-2 block w-full text-base border border-gray-300 rounded-md shadow-sm focus:ring-[#00398A] focus:border-[#00398A]"
            placeholder="Mínimo 8 caracteres"
            onInvalid={(e) => e.target.setCustomValidity('Por favor, ingrese una contraseña')}
            onInput={(e) => e.target.setCustomValidity('')}
            aria-describedby={`${passwordHintId} ${error ? errorId : ''}`}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00398A]"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500" id={passwordHintId}>
          Use contraseñas seguras (Caracteres, mayúsculas, números y símbolos)
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar contraseña
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10 pr-10 py-2 block w-full text-base border border-gray-300 rounded-md shadow-sm focus:ring-[#00398A] focus:border-[#00398A]"
            placeholder="Repita su contraseña"
            onInvalid={(e) => e.target.setCustomValidity('Por favor, confirme su contraseña')}
            onInput={(e) => e.target.setCustomValidity('')}
            aria-describedby={error ? errorId : undefined}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button 
              type="button" 
              onClick={toggleConfirmPasswordVisibility}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00398A]"
              aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor de error siempre presente en el DOM pero oculto cuando no hay error */}
      <div 
        className={`bg-red-50 border-l-4 border-red-500 p-4 rounded ${error ? '' : 'hidden'}`}
        role="alert"
        aria-live="assertive"
        id={errorId}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error || "Error en el formulario"}</p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#00398A] hover:bg-[#002A66] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00398A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando solicitud...
            </span>
          ) : (
            <span className="flex items-center">
              Registrarse
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;