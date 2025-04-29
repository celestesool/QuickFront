import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import './Register.css'; // Tu nuevo CSS personalizado

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor ingresa un correo válido");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(email.trim(), password);
      localStorage.setItem("uid", response.data.uid);
      alert("Registro exitoso");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("Error al registrar. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="register-card"
      >
        <div className="register-header">
          <h1>Crear una cuenta</h1>
          <p>Regístrate para empezar</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="register-button"
          >
            {isLoading ? "Registrando..." : "Registrar cuenta"}
          </motion.button>

          <div className="register-login">
            ¿Ya tienes cuenta?{" "}
            <a href="/login">Inicia sesión</a>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
