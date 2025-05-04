import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import ClickableWordItem from './ClickableWordItem';
import ClickableDropZone from './ClickableDropZone';

// Componente MemoryArea mejorado con sistema de clics
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
  
  // Estado para el sistema de selección por clics
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(null);
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(null);
  
  // Mensaje de estado para accesibilidad
  const [statusMessage, setStatusMessage] = useState('');
  
  useEffect(() => {
    if (items && items.length > 0) {
      setErrors(0);
      setSuccesses(0);
      setSourceItems(items);
      setTargetItems(Array(items.length).fill(null));
      setDroppedStatus(Array(items.length).fill(false));
      setCorrectPositions(Array(items.length).fill(false));
      setPlacedItemIndices(new Set());
      setSelectedSourceIndex(null);
      setSelectedTargetIndex(null);
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
        return;
      }
      
      // Animación: Mostrar que se está autocompletando
      setAutoCompleteAnimation({
        sourceIndex,
        targetIndex: randomTargetIndex
      });
      
      // Efectuar el movimiento después de un breve delay para la animación
      setTimeout(() => {
        handleItemPlacement(sourceIndex, randomTargetIndex, correctItem.id);
        setAutoCompleteAnimation(null);
      }, 800);
    }
  }));

  // Maneja la selección de un ítem de origen (palabras)
  const handleSourceItemSelect = (sourceIndex, itemId, itemName) => {
    // Si el ítem ya está colocado, no hacer nada
    if (placedItemIndices.has(sourceIndex)) return;
    
    // Si ya hay un ítem seleccionado y se hace clic en el mismo, deseleccionarlo
    if (selectedSourceIndex === sourceIndex) {
      setSelectedSourceIndex(null);
      setStatusMessage('Selección cancelada');
      return;
    }
    
    // Seleccionar ítem
    setSelectedSourceIndex(sourceIndex);
    setSelectedTargetIndex(null);
    setStatusMessage(`Palabra "${itemName}" seleccionada. Ahora selecciona un espacio para colocarla.`);
    
    // Si hay un destino seleccionado, completar la acción
    if (selectedTargetIndex !== null) {
      handleItemPlacement(sourceIndex, selectedTargetIndex, itemId);
      setSelectedSourceIndex(null);
      setSelectedTargetIndex(null);
    }
  };
  
  // Maneja la selección de una zona de destino
  const handleTargetZoneSelect = (targetIndex) => {
    // Si la posición ya tiene un ítem, no hacer nada
    if (targetItems[targetIndex] !== null) {
      return;
    }
    
    // Si hay un ítem de origen seleccionado, completar la acción
    if (selectedSourceIndex !== null) {
      const selectedItem = sourceItems[selectedSourceIndex];
      handleItemPlacement(selectedSourceIndex, targetIndex, selectedItem.id);
      setSelectedSourceIndex(null);
      setSelectedTargetIndex(null);
      return;
    }
    
    // Si ya hay un destino seleccionado y se hace clic en el mismo, deseleccionarlo
    if (selectedTargetIndex === targetIndex) {
      setSelectedTargetIndex(null);
      setStatusMessage('Selección cancelada');
      return;
    }
    
    // Seleccionar destino
    setSelectedTargetIndex(targetIndex);
    setStatusMessage('Espacio seleccionado. Ahora selecciona una palabra para colocarla aquí.');
  };

  // Lógica para colocar un ítem en un espacio
  const handleItemPlacement = (sourceIndex, targetIndex, itemId) => {
    const newSourceItems = [...sourceItems];
    const newTargetItems = [...targetItems];
    const newDroppedStatus = [...droppedStatus];
    const newCorrectPositions = [...correctPositions];
    const newPlacedItemIndices = new Set(placedItemIndices);
    
    if (newTargetItems[targetIndex] !== null) {
      setStatusMessage('Este espacio ya está ocupado. Selecciona otro espacio.');
      return;
    }
    
    const movedItem = newSourceItems[sourceIndex];
    const isCorrectPosition = correctOrder[targetIndex]?.id === movedItem.id;
    
    // Actualizar estado
    newCorrectPositions[targetIndex] = isCorrectPosition;
    if (!isCorrectPosition) {
      setErrors(prev => prev + 1);
      setStatusMessage(`¡Incorrecto! La palabra "${movedItem.name}" no está en la posición correcta.`);
    } else {
      setSuccesses(prev => prev + 1);
      setStatusMessage(`¡Correcto! La palabra "${movedItem.name}" está en la posición correcta.`);
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
  
  // Función para quitar un ítem de una posición
  const handleRemoveFromTarget = (targetIndex) => {
    const sourceIndex = sourceItems.findIndex(item => 
      item && targetItems[targetIndex] && item.id === targetItems[targetIndex].id
    );
    
    if (sourceIndex === -1) return;
    
    const removedItem = targetItems[targetIndex];
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
    
    setStatusMessage(`Palabra "${removedItem.name}" removida de su posición.`);
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
      {/* Mensaje de estado para accesibilidad */}
      <div className="sr-only" aria-live="polite">
        {statusMessage}
      </div>
      
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
                  const isSelected = selectedSourceIndex === sourceIndex;
                  
                  return (
                    <ClickableWordItem
                      key={`source-${item.id}`}
                      id={item.id}
                      name={item.name}
                      index={sourceIndex}
                      isInDropZone={false}
                      isDisabled={isDisabled}
                      isAnimating={isAnimating}
                      isSelected={isSelected}
                      onSelect={handleSourceItemSelect}
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
                const isSelected = selectedTargetIndex === position;
                
                return (
                  <ClickableDropZone
                    key={`drop-${position}`}
                    index={position}
                    item={targetItems[position]}
                    isEmpty={targetItems[position] === null}
                    isCorrect={correctPositions[position]}
                    isAnimating={isAnimating}
                    isSelected={isSelected}
                    expectedItemId={correctOrder[position]?.id}
                    onSelect={handleTargetZoneSelect}
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
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label={areAllSlotsFilled() ? "Verificar orden y completar ronda" : "Completa todos los espacios antes de verificar"}
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