const ClickableWordItem = ({ 
    id, 
    name, 
    index, 
    isInDropZone, 
    isCorrectPosition, 
    onSelect,
    isDisabled,
    isAnimating,
    isSelected
}) => {
    const handleClick = () => {
        if (isDisabled) return;
        
        onSelect?.(index, id, name);
    };

    return (
        <div
            onClick={handleClick}
            className={`
                flex items-center justify-center
                w-full h-12 px-3 rounded-md
                transition-all duration-200 text-base font-medium text-center
                ${isAnimating 
                    ? 'bg-yellow-100 border-yellow-500 animate-pulse scale-110' 
                    : isDisabled 
                        ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' 
                        : isSelected
                            ? 'bg-blue-200 border-blue-700 cursor-pointer shadow-md ring-2 ring-blue-500 ring-opacity-50 scale-105' 
                            : isInDropZone 
                                ? isCorrectPosition 
                                    ? 'bg-green-100 border-green-500 cursor-pointer shadow-md' 
                                    : 'bg-white border-red-500 cursor-pointer shadow-md' 
                                : 'bg-white border-blue-500 cursor-pointer shadow-md hover:shadow-lg hover:bg-blue-50'}
                border-2
                ${!isDisabled ? 'hover:scale-105' : ''}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            `}
            tabIndex={isDisabled ? -1 : 0}
            role="button"
            aria-disabled={isDisabled}
            aria-pressed={isSelected}
            aria-label={`Palabra ${name}${isDisabled ? ', ya colocada' : ''}${isSelected ? ', seleccionada' : ''}`}
            onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {name}
        </div>
    );
};

export default ClickableWordItem;