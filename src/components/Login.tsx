import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

// src\services\api.js

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      localStorage.setItem("uid", response.data.uid);
      alert("Login exitoso");
      navigate("/dashboard"); // Te llevará luego al Dashboard
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={handleLogin}>Entrar</button>
          <p>
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
    </div>
  );
};

export default Login;
