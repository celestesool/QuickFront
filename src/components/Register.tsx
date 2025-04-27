import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      alert("Por favor ingresa un email válido");
      return;
    }
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const response = await registerUser(email.trim(), password);
      localStorage.setItem("uid", response.data.uid);
      alert("Registro exitoso");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Error al registrar");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Registrar</button>
      <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
    </div>
  );
};

export default Register;
