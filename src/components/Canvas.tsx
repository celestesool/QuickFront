import React, { useRef, useState, useEffect } from 'react';
import { CanvasComponent } from '../types/canvasTypes';
import Moveable from 'react-moveable';

interface Props {
  elements: CanvasComponent[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  handleDrag: (id: string, x: number, y: number) => void;
  handleResize: (id: string, width: number, height: number) => void;
  handleRotate: (id: string, rotation: number) => void;
}

const Canvas: React.FC<Props> = ({
  elements,
  selectedId,
  setSelectedId,
  handleDrag,
  handleResize,
  handleRotate
}) => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isTransformMode, setIsTransformMode] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const updateSize = () => {
        setCanvasSize({
          width: canvasRef.current?.clientWidth || 0,
          height: canvasRef.current?.clientHeight || 0
        });
      };

      updateSize();
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(canvasRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleDeselect = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current && !isDragging) {
      setSelectedId(null);
      setIsTransformMode(false);
    }
  };

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsTransformMode(false);
  };

  const handleElementDoubleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsTransformMode(true);
  };

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onClick={handleDeselect}
      style={{
        position: 'relative',
        overflow: 'auto',
        flex: 1,
        background: '#f8f9fa',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        margin: '20px',
        minHeight: '600px',
        minWidth: '600px'
      }}
    >
      {elements.map((el) => {
        const isSelected = el.id === selectedId;

        return (
          <div
            key={el.id}
            ref={isSelected ? targetRef : null}
            onClick={(e) => handleElementClick(e, el.id)}
            onDoubleClick={(e) => handleElementDoubleClick(e, el.id)}
            style={{
              position: 'absolute',
              top: `${el.y}px`,
              left: `${el.x}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              transform: `rotate(${el.rotation}deg)`,
              zIndex: el.zIndex,
              ...el.styles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
              border:
                isSelected && isTransformMode
                  ? '2px dashed #3a86ff'
                  : isSelected
                  ? '1px solid #90e0ef'
                  : 'none',
              boxShadow:
                isSelected && !isTransformMode
                  ? '0 0 5px rgba(0, 123, 255, 0.3)'
                  : 'none',
              cursor: isSelected ? 'move' : 'default',
              boxSizing: 'border-box'
            }}
          >
            {/* Renderizado seguro por tipo */}
            {el.type === 'button' && (
              <button style={{ width: '100%', height: '100%' }}>{el.content}</button>
            )}

            {el.type === 'input' && (
              <div style={{ width: '100%', height: '100%' }} onMouseDown={(e) => e.preventDefault()}>
                <input
                  placeholder={el.content}
                  style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                />
              </div>
            )}

            {el.type === 'text' && (
              <p style={{ margin: 0 }}>{el.content}</p>
            )}

            {el.type === 'image' && (
              <img src={el.content} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            )}

            {el.type === 'frame' && (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(200, 200, 255, 0.1)',
                border: '1px dashed #999'
              }} />
            )}
          </div>
        );
      })}

      {selectedId && (
        <Moveable
          target={targetRef.current}
          draggable={true}
          scalable={isTransformMode}
          rotatable={isTransformMode}
          resizable={isTransformMode}
          bounds={{
            left: 0,
            top: 0,
            right: canvasSize.width,
            bottom: canvasSize.height
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={({ left, top }) => {
            if (selectedId) handleDrag(selectedId, left, top);
          }}
          onScale={({ target, transform, drag }) => {
            if (isTransformMode && selectedId && target) {
              const width = parseFloat(target.style.width);
              const height = parseFloat(target.style.height);
              handleResize(selectedId, width, height);
            }
          }}
          onResize={({ target, width, height, drag }) => {
            if (isTransformMode && selectedId && target) {
              target.style.width = `${width}px`;
              target.style.height = `${height}px`;
              handleResize(selectedId, width, height);
            }
          }}
          onRotate={({ beforeRotate }) => {
            if (isTransformMode && selectedId) {
              handleRotate(selectedId, beforeRotate);
            }
          }}
          keepRatio={false}
          origin={false}
          edge={false}
          throttleDrag={1}
          throttleScale={0.01}
          throttleRotate={1}
          pinchable={isTransformMode}
        />
      )}
    </div>
  );
};

export default Canvas;