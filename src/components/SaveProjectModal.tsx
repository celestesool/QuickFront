import React, { useState } from 'react';

interface SaveProjectModalProps {
  onSave: (projectName: string) => void;
  onCancel: () => void;
}

const SaveProjectModal: React.FC<SaveProjectModalProps> = ({ onSave, onCancel }) => {
  const [projectName, setProjectName] = useState('');

  const handleSave = () => {
    if (projectName.trim() !== '') {
      onSave(projectName.trim());
    } else {
      alert("Por favor escribe un nombre válido.");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Guardar Proyecto</h2>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Nombre del proyecto"
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onCancel} style={{ padding: '0.5rem 1rem', backgroundColor: '#ddd', border: 'none', borderRadius: '4px' }}>Cancelar</button>
          <button onClick={handleSave} style={{ padding: '0.5rem 1rem', backgroundColor: '#9ea1ff', color: 'white', border: 'none', borderRadius: '4px' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default SaveProjectModal;
