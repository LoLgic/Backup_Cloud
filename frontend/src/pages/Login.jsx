import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/auth/login",
        formData
      );

      // Guardar token
      localStorage.setItem(
        "token",
        response.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refreshToken
      );

      localStorage.setItem(
        "role",
        response.data.user.role
      );

      alert("Login exitoso");

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error en login"
      );

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Cloud Backup ☁️
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Inicia sesión
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          />

          <button
            className="w-full bg-black text-white p-3 rounded-lg hover:opacity-90"
          >
            Iniciar Sesión
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">

          ¿No tienes cuenta?

          <Link
            to="/register"
            className="ml-2 text-black font-semibold"
          >
            Registrarse
          </Link>

        </p>

      </div>

    </div>
  );

}

export default Login;