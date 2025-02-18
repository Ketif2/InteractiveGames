import React from 'react';

const AnswerInputs = ({ hiddenCount, answers, onChange, config, isPaused }) => (
    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
            <p className="text-xl md:text-2xl mb-4 text-gray-700 font-medium text-center">
                Números que faltan:
            </p>
            <div className="flex flex-wrap gap-4 justify-center pb-4">
                {Array(hiddenCount).fill(0).map((_, index) => (
                    <input
                        key={index}
                        type="number"
                        value={answers[index] || ''}
                        onChange={(e) => onChange(index, e.target.value)}
                        className="w-20 h-20 md:w-24 md:h-24 text-3xl md:text-4xl text-center 
                                 border-4 border-[#00398A] rounded-xl
                                 focus:outline-none focus:border-[#00A8E3] bg-white shadow-md"
                        min={config.startRange}
                        max={config.endRange}
                        disabled={isPaused}
                    />
                ))}
            </div>
        </div>
    </div>
);

export default AnswerInputs;