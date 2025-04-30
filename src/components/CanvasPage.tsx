import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import RightPanel from './RightPanel';
import ProjectsList from './ProjectsList';
import SaveProjectModal from './SaveProjectModal';
import { CanvasComponent, ComponentType } from '../types/canvasTypes';
import { getUserProjects, createProject, updateProject, getProjectById } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import '../style.css';
import UserPanel from './UserPanel';
import { exportToAngular } from './exportUtils';
const initialElements: CanvasComponent[] = [];

const CanvasPage = () => {
  const [userData, setUserData] = useState<{name: string, email: string}>({name: '', email: ''});
  const [elements, setElements] = useState<CanvasComponent[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjectsList, setShowProjectsList] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [loadedElements, setLoadedElements] = useState<CanvasComponent[]>([]);
  const [showJoinProjectModal, setShowJoinProjectModal] = useState(false);
  const [joinProjectId, setJoinProjectId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();
    const { socket } = useSocket();
    const email = localStorage.getItem('userEmail') || 'Sin sesión';

  const handleSaveProject = () => setShowSaveModal(true);

  const handleLogout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("currentProjectId");
    alert("Sesión cerrada exitosamente");
    setTimeout(() => {
      navigate("/login", { replace: true });
      window.location.reload();
    }, 300);
  };

  const handleJoinProject = () => {
    if (joinProjectId.trim() && socket) {
      localStorage.setItem("currentProjectId", joinProjectId);
      socket.emit('join-project', joinProjectId);
      alert(`Te uniste al proyecto: ${joinProjectId}`);
      setShowJoinProjectModal(false);
      window.location.reload();
    }
  };

  const handleConfirmSaveProject = async (projectName: string) => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      alert("Debes iniciar sesión para guardar un proyecto.");
      return;
    }
    try {
      await createProject(uid, projectName, elements);
      alert("Proyecto guardado exitosamente");
      setShowSaveModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el proyecto");
    }
  };

  const handleSaveAsNew = async (newName: string) => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      alert("Debes iniciar sesión para guardar.");
      return;
    }
    try {
      await createProject(uid, newName, elements);
      alert("Proyecto guardado como nuevo exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar nuevo proyecto");
    }
  };

  const handleCancelSaveProject = () => setShowSaveModal(false);

  const fetchProjects = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;
    try {
      const response = await getUserProjects(uid);
      setProjects(response.data.projects || []);
      setShowProjectsList(true);
    } catch (error) {
      console.error(error);
      alert("Error al cargar proyectos");
    }
  };

  const handleUpdateProject = async () => {
    if (!currentProjectId) return;
    const noChanges = JSON.stringify(elements) === JSON.stringify(loadedElements);
    if (noChanges) return;
    try {
      await updateProject(currentProjectId, elements);
      setLoadedElements(elements);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar proyecto");
    }
    };

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
      content: type === 'image' ? 'https://via.placeholder.com/150' :
               type === 'frame' ? `Frame ${elements.length + 1}` :
               type.toUpperCase(),
      styles: {
        backgroundColor: type === 'button' ? '#007bff' : type === 'square' ? '#3a86ff' : undefined,
        color: type === 'button' || type === 'square' ? '#fff' : undefined,
        fontSize: 14,
        border: type === 'frame' ? '1px dashed #aaa' : '1px solid #000',
      }
    };
    setElements(prev => [...prev, newElement]);
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

  useEffect(() => {
    if (!socket) return;

    const handleCanvasUpdate = (payload: { projectId: string, elements: CanvasComponent[] }) => {
      if (!isDragging && payload.projectId === currentProjectId) {
        setElements(payload.elements);
      }
    };

    socket.on('canvas-update', handleCanvasUpdate);

    return () => {
      socket.off('canvas-update', handleCanvasUpdate);
    };
  }, [socket, currentProjectId, isDragging]);

  useEffect(() => {
    const loadStoredProject = async () => {
      const storedProjectId = localStorage.getItem("currentProjectId");
      if (storedProjectId) {
        try {
          const response = await getProjectById(storedProjectId);
          setElements(response.data.data);
          setLoadedElements(response.data.data);
          setCurrentProjectId(storedProjectId);
          if (socket) {
            socket.emit('join-project', storedProjectId);
          }
        } catch (error) {
          console.error(error);
          alert("Error al cargar el proyecto almacenado");
          localStorage.removeItem("currentProjectId");
        }
      }
    };
    loadStoredProject();
  }, [socket]);
    


  useEffect(() => {
    const interval = setInterval(() => {
      if (currentProjectId) {
        const noChanges = JSON.stringify(elements) === JSON.stringify(loadedElements);
        if (!noChanges) {
          handleUpdateProject();
        }
      }
    }, 1000000);
    return () => clearInterval(interval);
  }, [elements, currentProjectId, loadedElements]);
    useEffect(() => {
    if (!socket) return;

    const handleCanvasInit = (elements: CanvasComponent[]) => {
      setElements(elements);
      setLoadedElements(elements);
    };

    const handleCanvasUpdate = (payload: { projectId: string, elements: CanvasComponent[] }) => {
      if (payload.projectId === currentProjectId) {
        // Solo actualizar si los elementos son diferentes
        if (JSON.stringify(payload.elements) !== JSON.stringify(elements)) {
          setElements(payload.elements);
        }
      }
    };

    socket.on('canvas-init', handleCanvasInit);
    socket.on('canvas-update', handleCanvasUpdate);

    return () => {
      socket.off('canvas-init', handleCanvasInit);
      socket.off('canvas-update', handleCanvasUpdate);
    };
  }, [socket, currentProjectId, elements]);

  // Función optimizada para enviar actualizaciones
  const sendCanvasUpdate = useCallback((newElements: CanvasComponent[]) => {
    if (!socket || !currentProjectId) return;
    
    // Cancelar actualización pendiente si existe
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Usar debounce para evitar demasiadas actualizaciones
    updateTimeoutRef.current = setTimeout(() => {
      socket.emit('canvas-update', { 
        projectId: currentProjectId, 
        elements: newElements 
      });
      setLastUpdate(Date.now());
    }, 300); // Ajusta este valor según necesidad (300ms es un buen punto de partida)
  }, [socket, currentProjectId]);

  useEffect(() => {
    // Enviar actualización cuando cambian los elementos
    if (Date.now() - lastUpdate > 300) { // Evitar bucles
      sendCanvasUpdate(elements);
    }
  }, [elements, sendCanvasUpdate, lastUpdate]);
    

  return (
      <div className="app">
       <UserPanel email={email} />
    
      <div className="sidebar-desktop">
        <Sidebar
                  onAdd={handleAdd}
                  onSave={handleSaveProject}
                  onOpenProjects={fetchProjects}
                  onUpdate={handleUpdateProject}
                  onLogout={handleLogout}
                  setShowJoinProjectModal={setShowJoinProjectModal}
                  onExportToAngular={() => exportToAngular(elements)}
                  onImportXml={(components) => setElements(prev => [...prev, ...components])}

                  
                  
                  
              />
              
      </div>

      {isMobileSidebarOpen && (
        <div className="sidebar-mobile">
          <Sidebar
                      onAdd={handleAdd}
                      onSave={handleSaveProject}
                      onOpenProjects={fetchProjects}
                      onUpdate={handleUpdateProject}
                      onLogout={handleLogout}
                      isMobile
                      setShowJoinProjectModal={setShowJoinProjectModal}
                      onExportToAngular={() => exportToAngular(elements)}
                      onImportXml={(components) => setElements(prev => [...prev, ...components])}            
              />
          <button className="sidebar-close-btn" onClick={() => setMobileSidebarOpen(false)}>✕</button>
        </div>
      )}

      {!isMobileSidebarOpen && (
        <button className="sidebar-toggle-btn" onClick={() => setMobileSidebarOpen(true)}>☰</button>
      )}

      <div className="canvas-wrapper">
        <Canvas
          elements={elements}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          handleDrag={(id, x, y) => {
          const newElements = elements.map(el => 
            el.id === id ? { ...el, x, y } : el
          );
          setElements(newElements);
          sendCanvasUpdate(newElements);
        }}
          handleResize={(id, width, height) => {
          const newElements = elements.map(el => 
            el.id === id ? { ...el, width, height } : el
          );
          setElements(newElements);
          sendCanvasUpdate(newElements);
        }}
          handleRotate={(id, rotation) => {
          const newElements = elements.map(el => 
            el.id === id ? { ...el, rotation } : el
          );
          setElements(newElements);
          sendCanvasUpdate(newElements);
        }}
          onStartDragging={() => setIsDragging(true)}
          onStopDragging={() => setIsDragging(false)}
        />
      </div>

      <RightPanel
        selectedElement={elements.find(el => el.id === selectedId) || null}
        onChange={handleChange}
        onDelete={handleDelete}
      />

      {showSaveModal && (
        <SaveProjectModal
          onSave={handleConfirmSaveProject}
          onCancel={handleCancelSaveProject}
        />
          )}
          {showShareModal && (
  <div className="share-code-modal">
    <h2>Compartir Código del Proyecto</h2>
    <div className="code-box">
      <input
        type="text"
        value={currentProjectId || ''}
        readOnly
      />
      <button
        className="copy-button"
        onClick={() => {
          if (currentProjectId) {
            navigator.clipboard.writeText(currentProjectId);
            alert('Código copiado al portapapeles!');
          }
        }}
      >
        Copiar
      </button>
    </div>
    <button className="close-button" onClick={() => setShowShareModal(false)}>Cerrar</button>
  </div>
)}

          

      {showProjectsList && (
        <ProjectsList
          projects={projects}
          onSelect={(project) => {
            setElements(project.data);
            setCurrentProjectId(project.id);
            setLoadedElements(project.data);
            localStorage.setItem("currentProjectId", project.id);
            alert(`Proyecto "${project.name}" cargado`);
            if (socket) {
              socket.emit('join-project', project.id);
            }
            setShowProjectsList(false);
          }}
          onClose={() => setShowProjectsList(false)}
        />
      )}

      {showJoinProjectModal && (
        <div className="join-project-modal">
          <h2>Unirse a un Proyecto Existente</h2>
          <input
            type="text"
            placeholder="Código del Proyecto"
            value={joinProjectId}
            onChange={(e) => setJoinProjectId(e.target.value)}
          />
          <button onClick={handleJoinProject}>Unirse</button>
          <button onClick={() => setShowJoinProjectModal(false)}>Cancelar</button>
        </div>
          )}
          
    </div>
  );
};

export default CanvasPage;
