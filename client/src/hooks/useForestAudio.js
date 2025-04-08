// src/hooks/useForestAudio.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useForestAudio = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef(null);

  // Inicializa el sistema de audio
  useEffect(() => {
    const handleInteraction = () => {
      // Inicializar audio después de la primera interacción
      if (!audioReady) {
        initializeAudio();
      }
    };
    
    // Agregar listeners a eventos comunes de interacción
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    
    return () => {
      // Limpiar listeners y recursos de audio
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioReady]);

  const initializeAudio = useCallback(() => {
    try {
      if (!audioRef.current) {
        // Crea un elemento de audio sin asignar fuente inmediatamente
        audioRef.current = new Audio();
        audioRef.current.volume = 0.9;
        audioRef.current.loop = true;
        
        // Marca el audio como listo para usar
        setAudioReady(true);
      }
    } catch (error) {
      console.error("Error al inicializar audio:", error);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    // Inicializar audio si es la primera vez
    if (!audioReady) {
      initializeAudio();
    }
    
    setAudioEnabled(prev => {
      const newState = !prev;
      
      try {
        if (newState && audioRef.current) {
          // Asignar fuente solo al activar
          audioRef.current.src = '/audio/forest-ambience.mp3';
          audioRef.current.play().catch(e => {
            console.log('Error al reproducir audio de fondo:', e);
          });
        } else if (audioRef.current) {
          audioRef.current.pause();
        }
      } catch (error) {
        console.error("Error al cambiar estado de audio:", error);
      }
      
      return newState;
    });
  }, [audioReady, initializeAudio]);

  // Función para reproducir efectos de sonido
  const playSound = useCallback((type) => {
    if (!audioEnabled || !audioReady) return;
    
    try {
      const sound = new Audio();
      
      switch(type) {
        case 'correct':
          sound.src = '/audio/correct.mp3';
          break;
        case 'error':
          sound.src = '/audio/error.mp3';
          break;
        case 'level-complete':
          sound.src = '/audio/level-complete.mp3';
          break;
        case 'help':
          sound.src = '/audio/help.mp3';
          break;
        default:
          return;
      }
      
      sound.volume = 0.6;
      
      // Reproducir solo si está listo
      sound.play().catch(e => {
        console.log(`Error reproduciendo sonido ${type}:`, e);
      });
    } catch (error) {
      console.error("Error en playSound:", error);
    }
  }, [audioEnabled, audioReady]);

  return {
    audioEnabled,
    audioReady,
    toggleAudio,
    playSound,
    initializeAudio
  };
};

export default useForestAudio;