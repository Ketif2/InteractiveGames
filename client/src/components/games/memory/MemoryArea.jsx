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
  onCheckResult 
}) => {
  // Calculate items per row based on difficulty
  const itemsPerRow = difficulty === 'fácil' ? 5 : 7;
  
  // State for source and target items
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [droppedStatus, setDroppedStatus] = useState([]);
  
  // Keep track of placed items to avoid duplicates
  const [placedItemIndices, setPlacedItemIndices] = useState(new Set());
  
  // Initialize items on component mount or when items change
  useEffect(() => {
    if (items && items.length > 0) {
      // Initialize source items from props
      setSourceItems(items);
      
      // Initialize target slots with empty placeholders
      setTargetItems(Array(items.length).fill(null));
      
      // Initialize dropped status array
      setDroppedStatus(Array(items.length).fill(false));
      
      // Clear placed items
      setPlacedItemIndices(new Set());
    }
  }, [items]);

  // Handle dropping an item from source to target zone
  const handleDrop = (sourceIndex, targetIndex) => {
    // Create copies of current states
    const newSourceItems = [...sourceItems];
    const newTargetItems = [...targetItems];
    const newDroppedStatus = [...droppedStatus];
    const newPlacedItemIndices = new Set(placedItemIndices);
    
    // Check if target position is already occupied
    if (newTargetItems[targetIndex] !== null) {
      return; // Don't allow drop if slot is already filled
    }
    
    // Get the item being moved
    const movedItem = newSourceItems[sourceIndex];
    
    // Move item from source to target
    newTargetItems[targetIndex] = movedItem;
    
    // Update dropped status
    newDroppedStatus[targetIndex] = true;
    
    // Track that this source item has been placed
    newPlacedItemIndices.add(sourceIndex);
    
    // Update states
    setTargetItems(newTargetItems);
    setDroppedStatus(newDroppedStatus);
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
    const newPlacedItemIndices = new Set(placedItemIndices);
    
    // Remove item from target
    newTargetItems[targetIndex] = null;
    newDroppedStatus[targetIndex] = false;
    
    // Remove from placed items tracking
    newPlacedItemIndices.delete(sourceIndex);
    
    // Update states
    setTargetItems(newTargetItems);
    setDroppedStatus(newDroppedStatus);
    setPlacedItemIndices(newPlacedItemIndices);
    
    // Call parent callback
    onOrderChange(newTargetItems);
  };
  
  // Check if all slots are filled
  const areAllSlotsFilled = () => {
    return targetItems.every(item => item !== null);
  };
  
  // Check button click handler
  const handleCheckOrder = () => {
    if (!areAllSlotsFilled()) {
      alert('Por favor, completa todos los espacios antes de verificar');
      return false;
    }
    
    // Check if order is correct (ascending by ID)
    const isCorrect = targetItems.every((item, index, arr) => {
      if (index === 0) return true;
      return item.id > arr[index - 1].id;
    });
    
    // Send result to parent
    onCheckResult(isCorrect);
    return isCorrect;
  };
  
  // Calculate number of rows needed and distribute items
  const generateRows = () => {
    const rows = [];
    const totalItems = items.length;
    
    for (let i = 0; i < 4; i++) {
      const startIdx = i * itemsPerRow;
      const endIdx = Math.min(startIdx + itemsPerRow, totalItems);
      rows.push(sourceItems.slice(startIdx, endIdx));
    }
    
    return rows;
  };

  // Generate target item rows
  const generateTargetRows = () => {
    const rows = [];
    const totalItems = items.length;
    
    for (let i = 0; i < 4; i++) {
      const startIdx = i * itemsPerRow;
      const endIdx = Math.min(startIdx + itemsPerRow, totalItems);
      rows.push(Array(endIdx - startIdx).fill(null).map((_, idx) => startIdx + idx));
    }
    
    return rows;
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
                    isCorrect={true} // This will be determined when checking
                    onDrop={handleDrop}
                    onRemove={() => handleRemoveFromTarget(position)}
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
          Verificar Orden
        </button>
      </div>
    </div>
  );
};

export default MemoryArea;