import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import { CanvasComponent, ComponentType } from './types/canvasTypes';
import './style.css';

const initialElements: CanvasComponent[] = [];

const App = () => {
  const [elements, setElements] = useState<CanvasComponent[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleAdd = (type: ComponentType) => {
    const newElement: CanvasComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      width: type === 'text' ? 120 : 150,
      height: type === 'text' ? 40 : 50,
      rotation: 0,
      zIndex: elements.length + 1,
      content: type === 'image'
        ? 'https://via.placeholder.com/150'
        : type === 'frame'
        ? `Frame ${elements.length + 1}`
        : type.toUpperCase(),
      styles: {
        backgroundColor: type === 'button' ? '#007bff' :
                         type === 'square' ? '#3a86ff' : undefined,
        color: type === 'button' || type === 'square' ? '#fff' : undefined,
        fontSize: 14,
        border: type === 'frame' ? '1px dashed #aaa' : '1px solid #000'
      }
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleDrag = (id: string, x: number, y: number) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, x, y } : el));
  };

  const handleResize = (id: string, width: number, height: number) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, width, height } : el));
  };

  const handleRotate = (id: string, rotation: number) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, rotation } : el));
  };

  const handleChange = (key: string, value: any) => {
    if (!selectedId) return;
    setElements(prev =>
      prev.map(el =>
        el.id === selectedId
          ? key in el
            ? { ...el, [key]: value }
            : { ...el, styles: { ...el.styles, [key]: value } }
          : el
      )
    );
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setElements(prev => prev.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="app">
      {/* Sidebar desktop */}
      <div className="sidebar-desktop">
        <Sidebar onAdd={handleAdd} />
      </div>

      {/* Sidebar móvil */}
      {isMobileSidebarOpen && (
        <div className="sidebar-mobile">
          <Sidebar onAdd={handleAdd} isMobile />
          <button className="sidebar-close-btn" onClick={() => setMobileSidebarOpen(false)}>✕</button>
        </div>
      )}

      {/* Botón flotante abrir sidebar */}
      {!isMobileSidebarOpen && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setMobileSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Canvas en wrapper */}
      <div className="canvas-wrapper">
        <Canvas
          elements={elements}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          handleDrag={handleDrag}
          handleResize={handleResize}
          handleRotate={handleRotate}
        />
      </div>

      {/* Panel derecho */}
      <RightPanel
        selectedElement={elements.find(el => el.id === selectedId) || null}
        onChange={handleChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default App;
