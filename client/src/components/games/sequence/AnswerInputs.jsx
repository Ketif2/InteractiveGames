import React, { useEffect } from 'react';

const AnswerInputs = ({ 
    hiddenCount, 
    answers, 
    onChange, 
    isPaused, 
    incorrectAnswers, 
    correctAnswers,
    onCheck 
}) => {
    const inputs = Array.from({ length: hiddenCount }, (_, i) => i);
    
    useEffect(() => {
        if (incorrectAnswers && incorrectAnswers.length > 0) {
            incorrectAnswers.forEach(index => {
                onChange(index, '');
            });
        }
    }, [incorrectAnswers, onChange]);
    
    const handleInputChange = (index, value) => {
        if (value === '') {
            onChange(index, '');
            return;
        }
        
        const numValue = value.replace(/\D/g, ''); 
        onChange(index, numValue);
    };
    
    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onCheck();
        }
    };
    
    return (
        <div className="bg-white py-3 sm:py-4 px-4 shadow-lg rounded-b-3xl">
            <div className="flex flex-col items-center">
                <p className="text-[#00398A] font-semibold mb-2 sm:mb-4 text-base sm:text-lg md:text-xl" id="inputsLabel">
                    Completa los números que faltan en la secuencia:
                </p>
                
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center mb-3 sm:mb-4 md:mb-6 w-full"
                     role="group" 
                     aria-labelledby="inputsLabel">
                    {inputs.map((index) => {
                        const isCorrect = correctAnswers && correctAnswers.includes(index);
                        const isIncorrect = incorrectAnswers && incorrectAnswers.includes(index);
                        
                        if (isCorrect) {
                            return null;
                        }
                        
                        return (
                            <div 
                                key={index} 
                                className={`relative ${isIncorrect ? 'animate-shake' : ''}`}
                            >
                                <label htmlFor={`answer-input-${index}`} className="sr-only">
                                    Número faltante {index + 1}
                                </label>
                                <input
                                    id={`answer-input-${index}`}
                                    type="text" 
                                    inputMode="numeric"
                                    pattern="[0-9]*" 
                                    value={answers[index] || ''}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    disabled={isPaused}
                                    aria-label={`Número faltante ${index + 1}`}
                                    className={`
                                        w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 
                                        text-center text-xl sm:text-2xl md:text-3xl font-bold 
                                        ${isIncorrect 
                                            ? 'border-4 border-red-500 focus:border-red-500' 
                                            : 'border-2 border-[#00398A] focus:border-[#00A8E3]'
                                        }
                                        rounded-lg outline-none shadow-md
                                    `}
                                    placeholder="#"
                                />
                            </div>
                        );
                    })}
                </div>
                
                <button
                    onClick={onCheck}
                    disabled={isPaused}
                    className="
                        bg-[#00398A] text-white 
                        px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-4 
                        rounded-full font-semibold 
                        text-base sm:text-lg md:text-xl 
                        hover:bg-[#002d6f] transition-colors 
                        focus:outline-none focus:ring-2 focus:ring-[#00A8E3] 
                        disabled:opacity-50 shadow-lg
                    "
                >
                    Revisar
                </button>
            </div>
        </div>
    );
};

export default AnswerInputs;