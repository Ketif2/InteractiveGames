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
        navigate('/menu');
      }, 500); // Esperamos a que termine la animación de fade-out
    }, 2500); // 2.5 segundos para el mensaje de bienvenida

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#003380] to-[#0055b3] transition-opacity duration-500 ${
        showWelcome ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-white/10 p-6 rounded-full mb-6">
        <img
          src={brainLogo}
          alt="Brain Logo"
          className={`w-40 h-40 ${showWelcome ? 'animate-pulse' : ''}`}
        />
      </div>
      <h1 
        className={`text-4xl font-light text-white mt-8 transition-transform duration-500 ${
          showWelcome ? 'scale-100' : 'scale-95'
        }`}
      >
        <span className="font-bold">BIENVENIDO</span>
      </h1>
      <p className="text-blue-100 mt-4 opacity-80">Recuerda+</p>
    </div>
  );
};

export default MenuSlide;