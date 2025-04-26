import React from 'react';
import { ComponentType } from '../types/canvasTypes';
import { FiSquare, FiType, FiImage, FiLayers, FiMousePointer, FiMinimize2 } from 'react-icons/fi';
import { BsTextParagraph, BsInputCursorText } from 'react-icons/bs';
import { MdOutlineRectangle } from 'react-icons/md';

interface Props {
  onAdd: (type: ComponentType) => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<Props> = ({ onAdd, isMobile = false }) => {
  // Estilos base responsivos
  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '60px' : '240px',
    padding: isMobile ? '0.5rem' : '1rem',
    background: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    height: '100vh',
    overflowY: 'auto',
    zIndex: 10
  };

  const headerStyle: React.CSSProperties = {
    margin: '0 0 1rem 0',
    color: '#374151',
    fontSize: isMobile ? '0' : '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: isMobile ? '0' : '0.5rem 0.75rem',
    opacity: isMobile ? 0 : 1,
    transition: 'opacity 0.2s ease',
    whiteSpace: 'nowrap'
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: isMobile ? '0.75rem' : '0.75rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    marginBottom: '4px',
    width: '100%',
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#f3f4f6',
    color: '#111827'
  };

  const buttonActiveStyle: React.CSSProperties = {
    backgroundColor: '#e5e7eb'
  };

  const iconStyle: React.CSSProperties = {
    marginRight: isMobile ? '0' : '0.75rem',
    fontSize: '1.1rem',
    color: '#6b7280',
    flexShrink: 0
  };

  const buttonTextStyle: React.CSSProperties = {
    opacity: isMobile ? 0 : 1,
    transition: 'opacity 0.2s ease',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor || '';
    e.currentTarget.style.color = buttonHoverStyle.color || '';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = buttonBaseStyle.backgroundColor || '';
    e.currentTarget.style.color = buttonBaseStyle.color || '';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = buttonActiveStyle.backgroundColor || '';
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor || '';
  };

  // Componentes disponibles
  const components = [
    { type: 'frame', icon: <FiLayers style={iconStyle} />, label: 'Frame' },
    { type: 'square', icon: <MdOutlineRectangle style={iconStyle} />, label: 'Rectangle' },
    { type: 'button', icon: <FiSquare style={iconStyle} />, label: 'Button' },
    { type: 'text', icon: <FiType style={iconStyle} />, label: 'Text' },
    { type: 'input', icon: <BsInputCursorText style={iconStyle} />, label: 'Input' },
    { type: 'image', icon: <FiImage style={iconStyle} />, label: 'Image' }
  ];

  return (
    <div style={sidebarStyle}>
      {!isMobile && <h3 style={headerStyle}>Components</h3>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {components.map((component) => (
          <button
            key={component.type}
            onClick={() => onAdd(component.type as ComponentType)}
            style={buttonBaseStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            title={isMobile ? component.label : undefined}
          >
            {component.icon}
            <span style={buttonTextStyle}>{component.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;