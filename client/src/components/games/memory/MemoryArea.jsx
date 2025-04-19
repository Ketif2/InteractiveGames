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
  rows = 2
}) => {
  const itemsPerRow = 5;
  
  const [sourceItems, setSourceItems] = useState([]);
  const [targetItems, setTargetItems] = useState([]);
  const [droppedStatus, setDroppedStatus] = useState([]);
  const [correctPositions, setCorrectPositions] = useState([]);
  
  const [placedItemIndices, setPlacedItemIndices] = useState(new Set());
  
  const [errors, setErrors] = useState(0);
  const [successes, setSuccesses] = useState(0);

  const [correctOrder, setCorrectOrder] = useState([]);
  
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