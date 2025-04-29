import React from 'react';
import { ComponentType } from '../types/canvasTypes';
import { FiSquare, FiType, FiImage, FiLayers, FiSave, FiCloud, FiLogOut } from 'react-icons/fi';
import { BsInputCursorText } from 'react-icons/bs';
import { MdOutlineRectangle } from 'react-icons/md';

interface Props {
  onAdd: (type: ComponentType) => void;
  onSave: () => void;
  onOpenProjects: () => void;
  onUpdate?: () => void;
  onLogout: () => void;
  isMobile?: boolean;
  setShowJoinProjectModal: (open: boolean) => void; // ✅ importante
}

const Sidebar: React.FC<Props> = ({
  onAdd,
  onSave,
  onOpenProjects,
  onUpdate,
  onLogout,
  isMobile = false,
  setShowJoinProjectModal
}) => {

  // Estilos base
  const sidebarStyle: React.CSSProperties = {
    width: isMobile ? '60px' : '240px',
    padding: isMobile ? '0.5rem' : '1rem',
    background: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    zIndex: 10
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: isMobile ? '0.2rem' : '0.75rem 1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'left',
    marginBottom: isMobile ? '6px' : '4px',
    width: '100%',
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease'
  };

  const iconStyle: React.CSSProperties = {
    marginRight: isMobile ? '0' : '0.75rem',
    fontSize: isMobile ? '3rem' : '1.2rem',
    color: '#6b7280'
  };

  const buttonTextStyle: React.CSSProperties = {
    opacity: isMobile ? 0 : 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const components = [
    { type: 'frame', icon: <FiLayers style={iconStyle} />, label: 'Frame' },
    { type: 'square', icon: <MdOutlineRectangle style={iconStyle} />, label: 'Rectangle' },
    { type: 'button', icon: <FiSquare style={iconStyle} />, label: 'Button' },
    { type: 'text', icon: <FiType style={iconStyle} />, label: 'Text' },
    { type: 'input', icon: <BsInputCursorText style={iconStyle} />, label: 'Input' },
    { type: 'image', icon: <FiImage style={iconStyle} />, label: 'Image' }
  ];

  const handleShowProjectId = () => {
    const projectId = localStorage.getItem("currentProjectId");
    if (projectId) {
      alert(`Código del proyecto: ${projectId}`);
    } else {
      alert("No hay proyecto abierto");
    }
  };

  return (
    <div style={sidebarStyle}>
      {!isMobile && <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Components</h3>}

      {/* Botones de componentes */}
      {components.map((comp) => (
        <button
          key={comp.type}
          onClick={() => onAdd(comp.type as ComponentType)}
          style={buttonBaseStyle}
          title={isMobile ? comp.label : undefined}
        >
          {comp.icon}
          <span style={buttonTextStyle}>{comp.label}</span>
        </button>
      ))}

      {/* Guardar Proyecto */}
      <button onClick={onSave} style={{ ...buttonBaseStyle, marginTop: '1rem', backgroundColor: '#bff2f3', color: 'gray' }}>
        <FiSave style={iconStyle} />
        <span style={buttonTextStyle}>Guardar Proyecto</span>
      </button>

      {/* Actualizar Proyecto */}
      <button onClick={onUpdate} style={{ ...buttonBaseStyle, backgroundColor: '#d7e2f4', color: 'gray' }}>
        <FiCloud style={iconStyle} />
        <span style={buttonTextStyle}>Actualizar Proyecto</span>
      </button>

      {/* Mis Proyectos */}
      <button onClick={onOpenProjects} style={{ ...buttonBaseStyle, backgroundColor: '#c9d0f3', color: 'gray' }}>
        <FiLayers style={iconStyle} />
        <span style={buttonTextStyle}>Mis Proyectos</span>
      </button>

      {/* Compartir Código */}
      <button onClick={handleShowProjectId} style={buttonBaseStyle}>
        📄
        <span style={buttonTextStyle}>Compartir Código</span>
      </button>

      {/* Unirse a Proyecto */}
      <button onClick={() => setShowJoinProjectModal(true)} style={buttonBaseStyle}>
        🔗
        <span style={buttonTextStyle}>Unirse a Proyecto</span>
      </button>

      {/* Cerrar sesión */}
      <button onClick={onLogout} style={{ ...buttonBaseStyle, marginTop: '1rem', backgroundColor: '#ffffff', color: '#b91c1c', border: '1px solid #b91c1c' }}>
        <FiLogOut style={{ ...iconStyle, color: '#b91c1c' }} />
        <span style={{ ...buttonTextStyle, color: '#b91c1c' }}>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
