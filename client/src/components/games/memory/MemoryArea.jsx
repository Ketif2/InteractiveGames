import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import DraggableWordItem from './DraggableWordItem';
import DropZone from './DropZone';

// El problema es la forma en que estamos usando forwardRef
// Corregiremos esto siguiendo la sintaxis correcta de React
const MemoryArea = forwardRef(function MemoryArea({ 
  items, 
  difficulty,
  gameMode,
  showItems, 
  onOrderChange,
  onCheckResult,
  onErrorsChange,
  rows = 2
}, ref) {
  const itemsPerRow = 5;
  
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [droppedStatus, setDroppedStatus] = useState([]);
  const [correctPositions, setCorrectPositions] = useState([]);
  
  const [placedItemIndices, setPlacedItemIndices] = useState(new Set());
  
  const [errors, setErrors] = useState(0);
  const [successes, setSuccesses] = useState(0);

  const [correctOrder, setCorrectOrder] = useState([]);
  const [autoCompleteAnimation, setAutoCompleteAnimation] = useState(null);
  
  useEffect(() => {
    if (items && items.length > 0) {
      setErrors(0);
      setSuccesses(0);
      setSourceItems(items);
      setTargetItems(Array(items.length).fill(null));
      setDroppedStatus(Array(items.length).fill(false));
      setCorrectPositions(Array(items.length).fill(false));
      setPlacedItemIndices(new Set());
      const sorted = [...items].sort((a, b) => a.id - b.id);
      setCorrectOrder(sorted);
    }
  }, [items]);
  
  // Exponer funciones al componente padre a través de la referencia
  useImperativeHandle(ref, () => ({
    autocompleteRandomItem: () => {
      // Encontrar posiciones disponibles
      const availableTargetPositions = targetItems
        .map((item, index) => item === null ? index : -1)
        .filter(index => index !== -1);
      
      // Si no hay posiciones disponibles, no hacer nada
      if (availableTargetPositions.length === 0) return;
      
      // Seleccionar una posición al azar
      const randomTargetIndex = availableTargetPositions[
        Math.floor(Math.random() * availableTargetPositions.length)
      ];
      
      // Encontrar el ítem correcto para esa posición
      const correctItem = correctOrder[randomTargetIndex];
      
      // Buscar el índice del ítem correcto en sourceItems
      const sourceIndex = sourceItems.findIndex(item => 
        item && correctItem && item.id === correctItem.id
      );
      
      // Verificar si el ítem ya ha sido colocado
      if (sourceIndex === -1 || placedItemIndices.has(sourceIndex)) {
        // Intentar con otro ítem si este ya fue colocado
        return; // Removemos la llamada recursiva que podría causar problemas
      }
      
      // Animación: Mostrar que se está autocompletando
      setAutoCompleteAnimation({
        sourceIndex,
        targetIndex: randomTargetIndex
      });
      
      // Efectuar el drop después de un breve delay para la animación
      setTimeout(() => {
        handleDrop(sourceIndex, randomTargetIndex, correctItem.id);
        setAutoCompleteAnimation(null);
      }, 800);
    }
  }));

  const handleDrop = (sourceIndex, targetIndex, itemId) => {
    const newSourceItems = [...sourceItems];
    const newTargetItems = [...targetItems];
    const newDroppedStatus = [...droppedStatus];
    const newCorrectPositions = [...correctPositions];
    const newPlacedItemIndices = new Set(placedItemIndices);
    
    if (newTargetItems[targetIndex] !== null) {
      return;
    }
    const movedItem = newSourceItems[sourceIndex];
    const isCorrectPosition = correctOrder[targetIndex]?.id === movedItem.id;
    
    newCorrectPositions[targetIndex] = isCorrectPosition;
    if (!isCorrectPosition) {
      setErrors(prev => prev + 1);
    } else {
      setSuccesses(prev => prev + 1);
    }
    
    newTargetItems[targetIndex] = movedItem;
    newDroppedStatus[targetIndex] = true;
    newPlacedItemIndices.add(sourceIndex);
    
    setTargetItems(newTargetItems);
    setDroppedStatus(newDroppedStatus);
    setCorrectPositions(newCorrectPositions);
    setPlacedItemIndices(newPlacedItemIndices);
    
    onOrderChange(newTargetItems);
    
    if (onErrorsChange) {
      onErrorsChange(isCorrectPosition ? 0 : 1, isCorrectPosition ? 1 : 0);
    }
  };
  
  const handleRemoveFromTarget = (targetIndex) => {
    const sourceIndex = sourceItems.findIndex(item => 
      item && targetItems[targetIndex] && item.id === targetItems[targetIndex].id
    );
    
    if (sourceIndex === -1) return;
    
    const newTargetItems = [...targetItems];
    const newDroppedStatus = [...droppedStatus];
    const newCorrectPositions = [...correctPositions];
    const newPlacedItemIndices = new Set(placedItemIndices);
    
    const wasCorrect = newCorrectPositions[targetIndex];
    
    if (wasCorrect) {
      setSuccesses(prev => Math.max(0, prev - 1));
    } else {
      setErrors(prev => Math.max(0, prev - 1));
    }
    
    newTargetItems[targetIndex] = null;
    newDroppedStatus[targetIndex] = false;
    newCorrectPositions[targetIndex] = false;
    
    newPlacedItemIndices.delete(sourceIndex);
    
    setTargetItems(newTargetItems);
    setDroppedStatus(newDroppedStatus);
    setCorrectPositions(newCorrectPositions);
    setPlacedItemIndices(newPlacedItemIndices);
    
    onOrderChange(newTargetItems);
    
  };
  
  const areAllSlotsFilled = () => {
    return targetItems.every(item => item !== null);
  };
  
  const areAllPositionsCorrect = () => {
    return correctPositions.every(isCorrect => isCorrect === true) && areAllSlotsFilled();
  };
  
  const handleCheckOrder = () => {
    if (!areAllSlotsFilled()) {
      alert('Por favor, completa todos los espacios antes de verificar');
      return false;
    }
    
    const isCorrect = areAllPositionsCorrect();
    
    onCheckResult(isCorrect, 0, 0);
    return isCorrect;
  };
  
  const generateRows = () => {
    const totalRows = [];
    const totalItems = items.length;
    
    for (let i = 0; i < rows; i++) {
      const startIdx = i * itemsPerRow;
      const endIdx = Math.min(startIdx + itemsPerRow, totalItems);
      totalRows.push(sourceItems.slice(startIdx, endIdx));
    }
    
    return totalRows;
  };

  const generateTargetRows = () => {
    const totalRows = [];
    const totalItems = items.length;
    
    for (let i = 0; i < rows; i++) {
      const startIdx = i * itemsPerRow;
      const endIdx = Math.min(startIdx + itemsPerRow, totalItems);
      totalRows.push(Array(endIdx - startIdx).fill(null).map((_, idx) => startIdx + idx));
    }
    
    return totalRows;
  };

  if (!items || items.length === 0) {
    return <div>Cargando elementos...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {showItems && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Objetos a ordenar
          </h3>
          <div className="space-y-4">
            {generateRows().map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-3">
                {row.map((item, itemIndex) => {
                  const sourceIndex = (rowIndex * itemsPerRow) + itemIndex;
                  const isDisabled = placedItemIndices.has(sourceIndex);
                  const isAnimating = autoCompleteAnimation && autoCompleteAnimation.sourceIndex === sourceIndex;
                  
                  return (
                    <DraggableWordItem
                      key={`source-${item.id}`}
                      id={item.id}
                      name={item.name}
                      index={sourceIndex}
                      isInDropZone={false}
                      isDisabled={isDisabled}
                      isAnimating={isAnimating}
                      onDragStart={() => {}}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Zona para ordenar (del más ligero al más pesado)
        </h3>
        <div className="space-y-4">
          {generateTargetRows().map((row, rowIndex) => (
            <div key={`drop-row-${rowIndex}`} className="grid grid-cols-5 gap-3">
              {row.map((position) => {
                if (position >= items.length) return null;
                
                const isAnimating = autoCompleteAnimation && autoCompleteAnimation.targetIndex === position;
                
                return (
                  <DropZone
                    key={`drop-${position}`}
                    index={position}
                    item={targetItems[position]}
                    isEmpty={targetItems[position] === null}
                    isCorrect={correctPositions[position]}
                    isAnimating={isAnimating}
                    expectedItemId={correctOrder[position]?.id}
                    onDrop={handleDrop}
                    onRemove={handleRemoveFromTarget}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Check button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleCheckOrder}
          disabled={!areAllSlotsFilled()}
          className="px-8 py-3 bg-[#00398A] text-white rounded-lg
                  hover:bg-[#002d6f] transition-colors text-lg font-semibold
                  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Completar Ronda
        </button>
      </div>
    </div>
  );
});

// Asegúrate de que el nombre del componente sea visible en DevTools
MemoryArea.displayName = 'MemoryArea';

export default MemoryArea;