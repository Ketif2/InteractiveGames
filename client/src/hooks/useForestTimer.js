// src/hooks/useForestTimer.js
import { useState, useEffect, useRef, useCallback } from 'react';

const useForestTimer = (initialTime = 0, onTimeout = () => {}) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [timerActive, setTimerActive] = useState(initialTime > 0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Iniciar/detener el temporizador según estado
  useEffect(() => {
    if (timerActive && !isPaused && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timerRef.current);
            onTimeout();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [timerActive, isPaused, remainingTime, onTimeout]);

  // Resetear el temporizador
  const resetTimer = useCallback((newTime = initialTime) => {
    setRemainingTime(newTime);
    setTimerActive(newTime > 0);
  }, [initialTime]);

  // Pausar/reanudar temporizador
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Limpiar el temporizador
  const clearTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimerActive(false);
    setRemainingTime(0);
  }, []);

  return {
    remainingTime,
    timerActive,
    isPaused,
    resetTimer,
    togglePause,
    clearTimer
  };
};

export default useForestTimer;