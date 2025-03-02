// src/components/games/memory/MemoryArea.jsx
import React, { useState, useEffect } from 'react';
import DraggableWordItem from './DraggableWordItem';
import DropZone from './DropZone';

const MemoryArea = ({ 
  items, 
  difficulty,
  gameMode,
  showItems, 
  onOrderChange,
  onCheckResult,
  onErrorsChange,
  rows = 2 // Valor por defecto para compatibilidad: 2 filas
}) => {
  // El número de items por fila siempre es 5
  const itemsPerRow = 5;
  
  // State for source and target items
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [droppedStatus, setDroppedStatus] = useState([]);
  const [correctPositions, setCorrectPositions] = useState([]);
  
  // Keep track of placed items to avoid duplicates
  const [placedItemIndices, setPlacedItemIndices] = useState(new Set());
  
  // Track errors and successes for current round
  const [errors, setErrors] = useState(0);
  const [successes, setSuccesses] = useState(0);

  // Store the correct order of items based on their IDs
  const [correctOrder, setCorrectOrder] = useState([]);
  
  // Initialize items on component mount or when items change
  useEffect(() => {
    if (items && items.length > 0) {
      // Reset error and success counters for new round
      setErrors(0);
      setSuccesses(0);
      
      // Initialize source items from props
      setSourceItems(items);
      
      // Initialize target slots with empty placeholders
      setTargetItems(Array(items.length).fill(null));
      
      // Initialize dropped status array
      setDroppedStatus(Array(items.length).fill(false));
      
      // Initialize correctness array
      setCorrectPositions(Array(items.length).fill(false));
      
      // Clear placed items
      setPlacedItemIndices(new Set());

      // Set correct order based on item IDs
      const sorted = [...items].sort((a, b) => a.id - b.id);
      setCorrectOrder(sorted);
    }
  }, [items]);

  // Notify parent component of errors count when needed
  useEffect(() => {
    if (onErrorsChange) {
      onErrorsChange(errors, successes);
    }
  }, [errors, successes, onErrorsChange]);

  // Handle dropping an item from source to target zone
  const handleDrop = (sourceIndex, targetIndex, itemId) => {
    // Create copies of current states
    const newSourceItems = [...sourceItems];
    const newTargetItems = [...targetItems];
    const newDroppedStatus = [...droppedStatus];
    const newCorrectPositions = [...correctPositions];
    const newPlacedItemIndices = new Set(placedItemIndices);
    
    // Check if target position is already occupied
    if (newTargetItems[targetIndex] !== null) {
      return; // Don't allow drop if slot is already filled
    }
    
    // Get the item being moved
    const movedItem = newSourceItems[sourceIndex];
    
    // Check if this item is correctly placed
    const isCorrectPosition = correctOrder[targetIndex]?.id === movedItem.id;
    
    // Update correctness status
    newCorrectPositions[targetIndex] = isCorrectPosition;
    
    // Count error or success
    if (!isCorrectPosition) {
      setErrors(prev => prev + 1);
    } else {
      setSuccesses(prev => prev + 1);
    }
    
    // Move item from source to target
    newTargetItems[targetIndex] = movedItem;
    
    // Update dropped status
    newDroppedStatus[targetIndex] = true;
    
    // Track that this source item has been placed
    newPlacedItemIndices.add(sourceIndex);
    
    // Update states
    setTargetItems(newTargetItems);
    setDroppedStatus(newDroppedStatus);
    setCorrectPositions(newCorrectPositions);
    setPlacedItemIndices(newPlacedItemIndices);
    
    // Call parent callback
    onOrderChange(newTargetItems);
  };
  
  // Handle removing an item from target zone
  const handleRemoveFromTarget = (targetIndex) => {
    // Find which source item is in this target position
    const sourceIndex = sourceItems.findIndex(item => 
      item && targetItems[targetIndex] && item.id === targetItems[targetIndex].id
    );
    
    if (sourceIndex === -1) return;
    
    // Create copies of current states
    const newTargetItems = [...targetItems];
    const newDroppedStatus = [...droppedStatus];
    const newCorrectPositions = [...correctPositions];
    const newPlacedItemIndices = new Set(placedItemIndices);
    
    // Adjust error/success count if removing an item
    if (newCorrectPositions[targetIndex]) {
      setSuccesses(prev => Math.max(0, prev - 1));
    }
    
    // Remove item from target
    newTargetItems[targetIndex] = null;
    newDroppedStatus[targetIndex] = false;
    newCorrectPositions[targetIndex] = false;
    
    // Remove from placed items tracking
    newPlacedItemIndices.delete(sourceIndex);
    
    // Update states
    setTargetItems(newTargetItems);
    setDroppedStatus(newDroppedStatus);
    setCorrectPositions(newCorrectPositions);
    setPlacedItemIndices(newPlacedItemIndices);
    
    // Call parent callback
    onOrderChange(newTargetItems);
  };
  
  // Check if all slots are filled
  const areAllSlotsFilled = () => {
    return targetItems.every(item => item !== null);
  };
  
  // Check if all positions are correct
  const areAllPositionsCorrect = () => {
    return correctPositions.every(isCorrect => isCorrect === true) && areAllSlotsFilled();
  };
  
  // Check button click handler
  const handleCheckOrder = () => {
    if (!areAllSlotsFilled()) {
      alert('Por favor, completa todos los espacios antes de verificar');
      return false;
    }
    
    const isCorrect = areAllPositionsCorrect();
    
    // Send result to parent
    onCheckResult(isCorrect, errors, successes);
    return isCorrect;
  };
  
  // Calculate number of rows needed and distribute items
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

  // Generate target item rows
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

  // Only render if we have items
  if (!items || items.length === 0) {
    return <div>Cargando elementos...</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Source items section (top) */}
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
                  
                  return (
                    <DraggableWordItem
                      key={`source-${item.id}`}
                      id={item.id}
                      name={item.name}
                      index={sourceIndex}
                      isInDropZone={false}
                      isDisabled={isDisabled}
                      onDragStart={() => {}}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Target drop zones section (bottom) */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Zona para ordenar (del más ligero al más pesado)
        </h3>
        <div className="space-y-4">
          {generateTargetRows().map((row, rowIndex) => (
            <div key={`drop-row-${rowIndex}`} className="grid grid-cols-5 gap-3">
              {row.map((position) => {
                if (position >= items.length) return null;
                
                return (
                  <DropZone
                    key={`drop-${position}`}
                    index={position}
                    item={targetItems[position]}
                    isEmpty={targetItems[position] === null}
                    isCorrect={correctPositions[position]}
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
};

export default MemoryArea;