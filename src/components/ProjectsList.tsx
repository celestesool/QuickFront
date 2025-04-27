import React from 'react';
import { deleteProject, getUserProjects } from '../services/api';

interface Project {
  id: string;
  name: string;
  data: any;
}

interface ProjectsListProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onClose: () => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onSelect, onClose }) => {
  
  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proyecto? 🚨")) {
      try {
        await deleteProject(id);
        alert("Proyecto eliminado correctamente");

        //  Actualizamos la lista automáticamente:
        const uid = localStorage.getItem("uid");
        if (uid) {
          const response = await getUserProjects(uid);
          window.dispatchEvent(new CustomEvent('updateProjects', { detail: response.data.projects }));
        }

      } catch (error) {
        console.error(error);
        alert("Error al eliminar proyecto");
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="modal">
        <h2>Mis Proyectos</h2>

        {projects.length === 0 ? (
          <p>No hay proyectos disponibles.</p>
        ) : (
          <ul className="project-list">
            {projects.map((project, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span 
                  onClick={() => onSelect(project)} 
                  style={{ cursor: 'pointer', flex: 1, textAlign: 'left' }}
                >
                  {project.name}
                </span>

                {/* Botón eliminar elegante */}
                <button 
                  onClick={() => handleDelete(project.id)} 
                  className="delete-button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14H6L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <button className="close-button" onClick={onClose}>Cerrar</button>
      </div>
    </>
  );
};

export default ProjectsList;