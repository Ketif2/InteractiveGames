// components/loading/MenuSlide.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import brainLogo from '../../assets/brain-logo.svg';

const MenuSlide = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setTimeout(() => {
        navigate('/menu'); // Cambiado a /menu ya que no tenemos psycho-info aún
      }, 500); // Esperamos a que termine la animación de fade-out
    }, 2500); // 2.5 segundos para el mensaje de bienvenida

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-screen bg-[#00398A] transition-opacity duration-500 ${
        showWelcome ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={brainLogo}
        alt="Brain Logo"
        className={`w-40 h-40 ${showWelcome ? 'animate-bounce' : ''}`}
      />
      <h1 
        className={`text-4xl font-bold text-white mt-8 transition-transform duration-500 ${
          showWelcome ? 'scale-100' : 'scale-95'
        }`}
      >
        BIENVENIDO
      </h1>
    </div>
  );
};

export default MenuSlide;