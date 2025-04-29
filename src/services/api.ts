import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // <-- tu backend local
  headers: {
    "Content-Type": "application/json",
  },
});

// Funciones de autenticación
export const registerUser = (email: string, password: string) => 
  API.post("/auth/register", { email, password });
// Login de usuario
export const loginUser = (email: string, password: string) => 
  API.post("/auth/login", { email, password });

// Funciones de proyectos
export const createProject = (uid: string, name: string, data: any) => 
  API.post("/projects/create", { uid, name, data });
// Obtener proyectos del usuario
export const getUserProjects = (uid: string) => 
  API.get(`/projects/user?uid=${uid}`);
// Eliminar proyecto
export const deleteProject = (id: string) => 
  API.delete(`/projects/${id}`);
// Obtener un proyecto por ID
export const getProjectById = (id: string) =>
  API.get(`/projects/${id}`);

// Actualizar proyecto
export const updateProject = (id: string, data: any) =>
  API.put(`/projects/${id}`, { data });

