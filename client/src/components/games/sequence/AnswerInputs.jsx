// src/components/games/sequence/AnswerInputs.jsx
import React from 'react';

const AnswerInputs = ({ 
    hiddenCount, 
    answers, 
    onChange, 
    config, 
    isPaused,
    incorrectAnswers,
    onCheck 
}) => (
    <div className="bg-white bg-opacity-95 shadow-lg px-4 py-6">
        <div className="max-w-4xl mx-auto">
            <p className="text-xl mb-6 text-gray-700 font-medium text-center">
                Números que faltan:
            </p>
            <div className="flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-4">
                    {Array(hiddenCount).fill(0).map((_, index) => (
                        <input
                            key={index}
                            type="number"
                            value={answers[index] || ''}
                            onChange={(e) => onChange(index, e.target.value)}
                            className={`
                                w-20 h-20 text-3xl text-center 
                                border-4 ${incorrectAnswers.includes(index) 
                                    ? 'border-red-500' 
                                    : 'border-[#00398A]'} 
                                rounded-xl focus:outline-none focus:border-[#00A8E3] 
                                bg-white shadow-md
                            `}
                            min={config.startRange}
                            max={config.endRange}
                            disabled={isPaused}
                        />
                    ))}
                </div>
                <button
                    onClick={onCheck}
                    disabled={isPaused}
                    className="px-8 py-3 bg-[#00398A] text-white text-lg font-medium 
                             rounded-lg hover:bg-[#002d6f] transition-colors shadow-md
                             disabled:opacity-50"
                >
                    Revisar
                </button>
            </div>
        </div>
    </div>
);

export default AnswerInputs;