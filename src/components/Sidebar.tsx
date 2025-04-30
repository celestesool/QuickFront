import React from 'react';
import { ComponentType, CanvasComponent } from '../types/canvasTypes';
import {
  FiSquare, FiType, FiImage, FiLayers, FiSave, FiCloud,
  FiLogOut, FiCircle, FiMinus, FiDownload
} from 'react-icons/fi';
import { BsInputCursorText } from 'react-icons/bs';
import { MdOutlineRectangle } from 'react-icons/md';
import XmlUpload from './XmlUpload';

interface Props {
  onAdd: (type: ComponentType) => void;
  onSave: () => void;
  onOpenProjects: () => void;
  onUpdate?: () => void;
  onLogout: () => void;
  isMobile?: boolean;
  onExportToAngular: () => void;
  setShowJoinProjectModal: (open: boolean) => void;
 onImportXml: (components: CanvasComponent[]) => void;

}

const Sidebar: React.FC<Props> = ({
  onAdd,
  onSave,
  onOpenProjects,
  onUpdate,
  onLogout,
  isMobile = false,
  setShowJoinProjectModal,
  onExportToAngular,
  onImportXml
}) => {
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
    { type: 'square', icon: <MdOutlineRectangle style={iconStyle} />, label: 'Rectángulo' },
    { type: 'circle', icon: <FiCircle style={iconStyle} />, label: 'Círculo' },
    { type: 'button', icon: <FiSquare style={iconStyle} />, label: 'Botón' },
    { type: 'text', icon: <FiType style={iconStyle} />, label: 'Texto' },
    { type: 'input', icon: <BsInputCursorText style={iconStyle} />, label: 'Input' },
    { type: 'line', icon: <FiMinus style={iconStyle} />, label: 'Línea' },
    { type: 'image', icon: <FiImage style={iconStyle} />, label: 'Imagen' }
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
      {!isMobile && <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Componentes</h3>}

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

      <div style={{ marginTop: '1rem' }}>
        <XmlUpload onImport={onImportXml} />
      </div>

      <button
        onClick={onExportToAngular}
        style={{
          ...buttonBaseStyle,
          marginTop: '1rem',
          backgroundColor: '#e0f7fa',
          color: '#00796b'
        }}
      >
        <FiDownload style={{ ...iconStyle, color: '#00796b' }} />
        <span style={buttonTextStyle}>Exportar a Angular</span>
      </button>

      <button onClick={onSave} style={{ ...buttonBaseStyle, backgroundColor: '#bff2f3', color: 'gray' }}>
        <FiSave style={iconStyle} />
        <span style={buttonTextStyle}>Guardar Proyecto</span>
      </button>

      <button onClick={onUpdate} style={{ ...buttonBaseStyle, backgroundColor: '#d7e2f4', color: 'gray' }}>
        <FiCloud style={iconStyle} />
        <span style={buttonTextStyle}>Actualizar Proyecto</span>
      </button>

      <button onClick={onOpenProjects} style={{ ...buttonBaseStyle, backgroundColor: '#c9d0f3', color: 'gray' }}>
        <FiLayers style={iconStyle} />
        <span style={buttonTextStyle}>Mis Proyectos</span>
      </button>

      <button onClick={handleShowProjectId} style={buttonBaseStyle}>
        📄
        <span style={buttonTextStyle}>Compartir Código</span>
      </button>

      <button onClick={() => setShowJoinProjectModal(true)} style={buttonBaseStyle}>
        🔗
        <span style={buttonTextStyle}>Unirse a Proyecto</span>
      </button>

      <button
        onClick={onLogout}
        style={{
          ...buttonBaseStyle,
          backgroundColor: '#ffffff',
          color: '#b91c1c',
          border: '1px solid #b91c1c'
        }}
      >
        <FiLogOut style={{ ...iconStyle, color: '#b91c1c' }} />
        <span style={{ ...buttonTextStyle, color: '#b91c1c' }}>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default Sidebar;
