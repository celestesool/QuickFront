import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import ProjectsList from './components/ProjectsList';
import SaveProjectModal from './components/SaveProjectModal';
import { CanvasComponent, ComponentType } from './types/canvasTypes';
import { getUserProjects, createProject, updateProject } from './services/api';
import './style.css';

const initialElements: CanvasComponent[] = [];

const App = () => {
  const [elements, setElements] = useState<CanvasComponent[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjectsList, setShowProjectsList] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [loadedElements, setLoadedElements] = useState<CanvasComponent[]>([]);

  // Abrir modal para guardar proyecto
  const handleSaveProject = () => {
    setShowSaveModal(true);
  };

  useEffect(() => {
  const interval = setInterval(() => {
    if (currentProjectId) {
      const noChanges = JSON.stringify(elements) === JSON.stringify(loadedElements);
      if (!noChanges) {
        handleUpdateProject();
      }
    }
  }, 1000000); // segundos

  return () => clearInterval(interval);
}, [elements, currentProjectId, loadedElements]);


  // Confirmar guardar proyecto
  const handleConfirmSaveProject = async (projectName: string) => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      alert("Debes iniciar sesión para guardar un proyecto.");
      return;
    }

    try {
      await createProject(uid, projectName, elements);
      alert("Proyecto guardado exitosamente ✨");
      setShowSaveModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el proyecto ❌");
    }
  };
  //guardar como nuevo
    const handleSaveAsNew = async (newName: string) => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      alert("Debes iniciar sesión para guardar.");
      return;
    }

    try {
      await createProject(uid, newName, elements);
      alert("Proyecto guardado como nuevo exitosamente ");
    } catch (error) {
      console.error(error);
      alert("Error al guardar como nuevo proyecto");
    }
  };


  // Cancelar guardado
  const handleCancelSaveProject = () => {
    setShowSaveModal(false);
  };

  // Cargar proyectos del usuario
  const fetchProjects = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    try {
      const response = await getUserProjects(uid);
      console.log("Proyectos recibidos:", response.data.projects);
      setProjects(response.data.projects || []);
      setShowProjectsList(true);
    } catch (error) {
      console.error(error);
      alert("Error al cargar proyectos ❌");
    }
  };

  // Actualizar proyecto
  const handleUpdateProject = async () => {
    if (!currentProjectId) {
      alert("Primero debes cargar un proyecto para actualizarlo.");
      return;
    }

    const noChanges = JSON.stringify(elements) === JSON.stringify(loadedElements);
    if (noChanges) {
      alert("No hay cambios para actualizar.");
      return;
    }

    try {
      await updateProject(currentProjectId, elements);
      alert("Proyecto actualizado exitosamente ✨");
      setLoadedElements(elements);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el proyecto ❌");
    }
  };

  // Agregar un nuevo componente al canvas
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
        border: type === 'frame' ? '1px dashed #aaa' : '1px solid #000',
      }
    };
    setElements(prev => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  // Funciones para manipular elementos
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
      {/* Sidebar escritorio */}
      <div className="sidebar-desktop">
        <Sidebar 
          onAdd={handleAdd}
          onSave={handleSaveProject}
          onOpenProjects={fetchProjects}
          onUpdate={handleUpdateProject}
        />
      </div>

      {/* Sidebar móvil */}
      {isMobileSidebarOpen && (
        <div className="sidebar-mobile">
          <Sidebar 
            onAdd={handleAdd}
            onSave={handleSaveProject}
            onOpenProjects={fetchProjects}
            isMobile
            onUpdate={handleUpdateProject}
          />
          <button className="sidebar-close-btn" onClick={() => setMobileSidebarOpen(false)}>✕</button>
        </div>
      )}

      {/* Botón para abrir sidebar en móvil */}
      {!isMobileSidebarOpen && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setMobileSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Canvas principal */}
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

      {/* Modal guardar proyecto */}
      {showSaveModal && (
        <SaveProjectModal
          onSave={handleConfirmSaveProject}
          onCancel={handleCancelSaveProject}
        />
      )}

      {/* Modal ver proyectos */}
      {showProjectsList && (
        <ProjectsList
          projects={projects}
          onSelect={(project) => {
            setElements(project.data);
            setCurrentProjectId(project.id);
            alert(`Proyecto "${project.name}" cargado`);
            setLoadedElements(project.data);
            setShowProjectsList(false);
          }}
          onClose={() => setShowProjectsList(false)}
        />
      )}
    </div>
  );
};

export default App;
