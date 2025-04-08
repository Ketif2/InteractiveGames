import React from 'react';

const AnswerInputs = ({ 
    hiddenCount, 
    answers, 
    onChange, 
    isPaused, 
    incorrectAnswers, 
    correctAnswers,
    onCheck 
}) => {
    // Crear un array con el número de inputs necesarios
    const inputs = Array.from({ length: hiddenCount }, (_, i) => i);
    
    // Manejar cambios en los campos de entrada
    const handleInputChange = (index, value) => {
        // Si el valor está vacío, permitimos borrarlo pasando un valor vacío
        if (value === '') {
            onChange(index, '');
            return;
        }
        
        // Para valores numéricos, los procesamos normalmente
        const numValue = value.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
        onChange(index, numValue);
    };
    
    return (
        <div className="bg-white py-4 px-6 shadow-lg rounded-t-3xl">
            <div className="flex flex-col items-center">
                <p className="text-[#00398A] font-semibold mb-4 text-lg">
                    Completa los números que faltan en la secuencia:
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                    {inputs.map((index) => {
                        const isCorrect = correctAnswers && correctAnswers.includes(index);
                        const isIncorrect = incorrectAnswers && incorrectAnswers.includes(index);
                        
                        // Si la respuesta es correcta, no mostramos el input
                        if (isCorrect) {
                            return null;
                        }
                        
                        return (
                            <div 
                                key={index} 
                                className={`relative ${isIncorrect ? 'animate-pulse' : ''}`}
                            >
                                <input
                                    type="text" // Cambiado de 'number' a 'text' para mejor control
                                    inputMode="numeric" // Sugerencia para mostrar teclado numérico en móviles
                                    pattern="[0-9]*" // Restringe la entrada a sólo números
                                    value={answers[index] || ''}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    disabled={isPaused}
                                    className={`
                                        w-16 h-16 text-center text-2xl font-bold 
                                        ${isIncorrect 
                                            ? 'border-4 border-red-500 focus:border-red-500' 
                                            : 'border-2 border-[#00398A] focus:border-[#00A8E3]'
                                        }
                                        rounded-lg outline-none
                                    `}
                                />
                            </div>
                        );
                    })}
                </div>
                
                <button
                    onClick={onCheck}
                    disabled={isPaused}
                    className="
                        bg-[#00398A] text-white px-8 py-3 rounded-full
                        font-semibold text-lg hover:bg-[#002d6f] 
                        transition-colors focus:outline-none focus:ring-2
                        focus:ring-[#00A8E3] disabled:opacity-50
                    "
                >
                    Revisar
                </button>
            </div>
        </div>
    );
};

export default AnswerInputs;