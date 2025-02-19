import React, { useEffect, useState } from 'react';

const AnswerInputs = ({ 
    hiddenCount, 
    answers, 
    onChange, 
    config, 
    isPaused,
    incorrectAnswers,
    onCheck 
}) => {
    const [containerSize, setContainerSize] = useState({
        inputSize: 'w-20 h-20',
        fontSize: 'text-2xl',
        gap: 'gap-3'
    });

    useEffect(() => {
        const updateSize = () => {
            const isMobile = window.innerWidth < 768;
            const containerWidth = window.innerWidth - (isMobile ? 32 : 64);
            const minGap = isMobile ? 8 : 12;
            const availableWidth = containerWidth - (hiddenCount - 1) * minGap;
            const maxInputSize = Math.floor(availableWidth / hiddenCount);

            let inputSize;
            let fontSize;
            let gap;

            if (isMobile) {
                inputSize = 'w-14 h-14';
                fontSize = 'text-xl';
                gap = 'gap-2';
            } else {
                if (maxInputSize >= 112) {
                    inputSize = 'w-20 h-20';
                    fontSize = 'text-4xl';
                    gap = 'gap-4';
                } else if (maxInputSize >= 80) {
                    inputSize = 'w-18 h-18';
                    fontSize = 'text-2xl';
                    gap = 'gap-3';
                } else {
                    inputSize = 'w-16 h-16';
                    fontSize = 'text-xl';
                    gap = 'gap-2';
                }
            }

            setContainerSize({ inputSize, fontSize, gap });
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [hiddenCount]);

    const handleInputChange = (index, value) => {
        // Permitir borrar o solo números
        if (value === '' || /^\d+$/.test(value)) {
            // Validar el rango solo si hay un valor
            if (value === '' || (parseInt(value) >= config.startRange && parseInt(value) <= config.endRange)) {
                onChange(index, value);
            }
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 shadow-lg">
            <div className="container mx-auto px-4 md:px-8 py-6">
                <p className="text-xl md:text-2xl mb-4 text-gray-700 font-medium text-center">
                    Números que faltan:
                </p>
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-7xl mx-auto bg-gray-50 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto hide-scrollbar">
                            <div className={`flex ${containerSize.gap} justify-center min-w-max px-2`}>
                                {Array(hiddenCount).fill(0).map((_, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        inputMode="numeric"
                                        value={answers[index] || ''}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className={`
                                            ${containerSize.inputSize}
                                            ${containerSize.fontSize}
                                            text-center 
                                            border-4 ${incorrectAnswers.includes(index) 
                                                ? 'border-red-500' 
                                                : 'border-[#00398A]'} 
                                            rounded-xl focus:outline-none focus:border-[#00A8E3] 
                                            bg-white shadow-md transition-all duration-200
                                            hide-spinners
                                        `}
                                        min={config.startRange}
                                        max={config.endRange}
                                        disabled={isPaused}
                                        onKeyDown={(e) => {
                                            if (!['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) &&
                                                !/^\d$/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onCheck}
                        disabled={isPaused}
                        className="px-8 py-3 bg-[#00398A] text-white text-lg font-medium 
                                 rounded-lg hover:bg-[#002d6f] transition-colors shadow-md
                                 disabled:opacity-50 mt-4"
                    >
                        Revisar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnswerInputs;