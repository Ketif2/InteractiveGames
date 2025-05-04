const ClickableDropZone = ({ 
    index, 
    item, 
    onSelect, 
    onRemove, 
    isEmpty, 
    isCorrect, 
    expectedItemId,
    isAnimating,
    isSelected
}) => {
    const handleClick = () => {
        if (!isEmpty) {
            onRemove(index);
        } else {
            onSelect(index);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                flex items-center justify-center
                w-full h-12 px-3 rounded-md 
                transition-all duration-200
                ${isAnimating 
                    ? 'bg-yellow-100 border-2 border-yellow-500 animate-pulse' 
                    : isSelected && isEmpty
                        ? 'bg-blue-100 border-2 border-blue-700 cursor-pointer shadow-md ring-2 ring-blue-500 ring-opacity-50'
                        : isEmpty 
                            ? 'bg-gray-100 border-dashed border-2 border-gray-300 cursor-pointer hover:bg-gray-50' 
                            : isCorrect 
                                ? 'bg-green-100 border-2 border-green-500 cursor-pointer hover:bg-green-50' 
                                : 'bg-red-100 border-2 border-red-500 cursor-pointer hover:bg-red-50'}
                shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            `}
            tabIndex={0}
            role="button"
            aria-label={isEmpty 
                ? `Espacio vacío${isSelected ? ', seleccionado' : ''}` 
                : `Palabra ${item?.name}${isCorrect ? ', posición correcta' : ', posición incorrecta'}`
            }
            data-expected-id={expectedItemId}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {!isEmpty && (
                <div className="flex justify-between items-center w-full">
                    <span className={`text-base font-medium ${!isCorrect ? 'text-red-600' : 'text-green-600'}`}>
                        {item?.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-1" aria-label="Quitar">×</span>
                </div>
            )}
            
            {isEmpty && !isAnimating && !isSelected && (
                <span className="text-gray-400 text-xs">Haz clic aquí</span>
            )}
            
            {isEmpty && isSelected && (
                <span className="text-blue-600 text-xs font-medium">Seleccionado</span>
            )}
            
            {isEmpty && isAnimating && (
                <span className="text-yellow-600 text-xs font-medium">Completando...</span>
            )}
        </div>
    );
};

export default ClickableDropZone;