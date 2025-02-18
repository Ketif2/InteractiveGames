import React from 'react';
import { AlertTriangle } from 'lucide-react';

const FeedbackOverlay = ({ 
    showCorrect, 
    showWrong, 
    showPause, 
    showExit, 
    showCompleted, 
    onPauseResume, 
    onExitConfirm, 
    onExitCancel,
    onGameComplete 
}) => (
    <>
        {showCorrect && (
            <div className="fixed inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center z-40">
                <div className="text-4xl font-bold text-green-600">¡Correcto!</div>
            </div>
        )}

        {showWrong && (
            <div className="fixed inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center z-40">
                <div className="text-4xl font-bold text-red-600">Intenta de nuevo</div>
            </div>
        )}

        {showPause && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-[#00398A] mb-4">Juego Pausado</h2>
                    <button
                        onClick={onPauseResume}
                        className="bg-[#00398A] text-white px-6 py-3 rounded-lg hover:bg-[#002d6f] transition-colors text-lg font-medium"
                    >
                        Reanudar
                    </button>
                </div>
            </div>
        )}

        {showExit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        ¿Seguro que quieres terminar el juego?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Todo el progreso actual se perderá.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={onExitCancel}
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-lg font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onExitConfirm}
                            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors text-lg font-medium"
                        >
                            Terminar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showCompleted && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg text-center">
                    <h2 className="text-3xl font-bold text-[#00398A] mb-4">
                        ¡Felicitaciones!
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">
                        Has completado el juego exitosamente
                    </p>
                    <button
                        onClick={onGameComplete}
                        className="bg-[#00398A] text-white px-6 py-3 rounded-lg hover:bg-[#002d6f] transition-colors text-lg font-medium"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        )}
    </>
);

export default FeedbackOverlay;