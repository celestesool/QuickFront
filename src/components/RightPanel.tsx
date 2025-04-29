import React, { useEffect, useState } from 'react';
import './RightPanel.css';
import { CanvasComponent } from '../types/canvasTypes';

interface Props {
  selectedElement: CanvasComponent | null;
  onChange: (key: string, value: any) => void;
  onDelete: () => void;
}

const RightPanel: React.FC<Props> = ({ selectedElement, onChange, onDelete }) => {
  const [visible, setVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768 && !visible) {
        setVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visible]);

  useEffect(() => {
    if (selectedElement) {
      setVisible(true);
    }
  }, [selectedElement]);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleChange = (key: string, value: any) => {
    onChange(key, value);
  };

  const handleStyleChange = (property: string, value: any) => {
    onChange('styles', { ...selectedElement?.styles, [property]: value });
  };

  if (!selectedElement && windowWidth <= 768) return null;
  if (!selectedElement) return null;

  return (
    <>
      {(!visible || windowWidth <= 768) && (
        <button className="toggle-panel-btn right" onClick={toggleVisibility} aria-label="Mostrar panel">
          ⚙️
        </button>
      )}

      {(visible || windowWidth > 768) && (
        <div className={`right-panel ${windowWidth <= 768 ? 'mobile' : ''}`}>
          {windowWidth <= 768 && <button className="close-btn" onClick={toggleVisibility}>×</button>}

          <h3>Propiedades - {selectedElement.type}</h3>
          <div className="panel-content">
            {selectedElement.type !== 'line' && (
              <>
                <label>Texto / Contenido:</label>
                <input
                  type="text"
                  value={selectedElement.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                />
              </>
            )}

            {(selectedElement.type === 'button' || selectedElement.type === 'input' || 
              selectedElement.type === 'square' || selectedElement.type === 'circle' || 
              selectedElement.type === 'frame') && (
              <>
                <label>Color de fondo:</label>
                <div className="color-input-container">
                  <input
                    type="color"
                    value={selectedElement.styles?.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{selectedElement.styles?.backgroundColor || '#ffffff'}</span>
                </div>
              </>
            )}

            {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'input') && (
              <>
                <label>Color de texto:</label>
                <div className="color-input-container">
                  <input
                    type="color"
                    value={selectedElement.styles?.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{selectedElement.styles?.color || '#000000'}</span>
                </div>
              </>
            )}

            <label>Ancho (px):</label>
            <input
              type="number"
              min="1"
              value={selectedElement.width || 0}
              onChange={(e) => handleChange('width', Math.max(1, parseInt(e.target.value) || 0))}
            />

            <label>Alto (px):</label>
            <input
              type="number"
              min="1"
              value={selectedElement.height || 0}
              onChange={(e) => handleChange('height', Math.max(1, parseInt(e.target.value) || 0))}
            />

            <label>Posición X (px):</label>
            <input
              type="number"
              value={selectedElement.x || 0}
              onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
            />

            <label>Posición Y (px):</label>
            <input
              type="number"
              value={selectedElement.y || 0}
              onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
            />

            <label>Rotación (grados):</label>
            <input
              type="number"
              value={selectedElement.rotation || 0}
              onChange={(e) => handleChange('rotation', parseInt(e.target.value) || 0)}
            />

            {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'input') && (
              <div className="style-section">
                <h4>Estilo de texto</h4>

                <label>Familia tipográfica:</label>
                <select
                  value={selectedElement.styles?.fontFamily || 'Arial'}
                  onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                </select>

                <label>Tamaño de fuente (px):</label>
                <input
                  type="number"
                  min="1"
                  value={parseInt(selectedElement.styles?.fontSize?.toString() || '14')}
                  onChange={(e) => handleStyleChange('fontSize', `${Math.max(1, parseInt(e.target.value) || 14)}px`)}
                />

                <div className="text-style-controls">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedElement.styles?.fontWeight === 'bold'}
                      onChange={(e) => handleStyleChange('fontWeight', e.target.checked ? 'bold' : 'normal')}
                    />
                    Negrita
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedElement.styles?.fontStyle === 'italic'}
                      onChange={(e) => handleStyleChange('fontStyle', e.target.checked ? 'italic' : 'normal')}
                    />
                    Cursiva
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedElement.styles?.textDecoration === 'underline'}
                      onChange={(e) => handleStyleChange('textDecoration', e.target.checked ? 'underline' : 'none')}
                    />
                    Subrayado
                  </label>
                </div>

                <label>Alineación de texto:</label>
                <select
                  value={selectedElement.styles?.textAlign || 'left'}
                  onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                >
                  <option value="left">Izquierda</option>
                  <option value="center">Centro</option>
                  <option value="right">Derecha</option>
                  <option value="justify">Justificado</option>
                </select>
              </div>
            )}

            {(selectedElement.type === 'button' || selectedElement.type === 'input' || 
              selectedElement.type === 'square' || selectedElement.type === 'frame' || 
              selectedElement.type === 'circle' || selectedElement.type === 'line') && (
              <div className="style-section">
                <h4>Estilo de borde</h4>
                <label>Color del borde:</label>
                <div className="color-input-container">
                  <input
                    type="color"
                    value={selectedElement.styles?.borderColor || '#000000'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{selectedElement.styles?.borderColor || '#000000'}</span>
                </div>

                <label>Grosor del borde (px):</label>
                <input
                  type="number"
                  min="0"
                  value={parseInt(selectedElement.styles?.borderWidth?.toString() || '1')}
                  onChange={(e) => handleStyleChange('borderWidth', `${Math.max(0, parseInt(e.target.value) || 1)}px`)}
                />

                {(selectedElement.type === 'button' || selectedElement.type === 'input' || 
                  selectedElement.type === 'square' || selectedElement.type === 'circle') && (
                  <>
                    <label>Radio de borde (px):</label>
                    <input
                      type="number"
                      min="0"
                      value={parseInt(selectedElement.styles?.borderRadius?.toString() || '0')}
                      onChange={(e) => handleStyleChange('borderRadius', `${Math.max(0, parseInt(e.target.value) || 0)}px`)}
                    />
                  </>
                )}
              </div>
            )}

            {selectedElement.type === 'image' && (
              <>
                <label>URL de la imagen:</label>
                <input
                  type="text"
                  value={selectedElement.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                />

                <label>Modo de ajuste:</label>
                <select
                  value={selectedElement.styles?.objectFit || 'contain'}
                  onChange={(e) => handleStyleChange('objectFit', e.target.value)}
                >
                  <option value="contain">Contener</option>
                  <option value="cover">Cubrir</option>
                  <option value="fill">Estirar</option>
                </select>
              </>
            )}

            <button className="delete-btn" onClick={onDelete}>🗑️ Eliminar elemento</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RightPanel;