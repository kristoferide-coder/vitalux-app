import React, { useState } from "react";
import "./App.css";
import bgImage from "./assets/vitalux-bg.jpg";

import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // ADMIN REAL
  const ADMIN_EMAIL = "vitaluxfit@gmail.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!email || !password) {
      setAuthError("Completa correo y contraseña.");
      return;
    }

    try {
      // Intentar login
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const loggedEmail = cred.user.email || email;
      const role = loggedEmail === ADMIN_EMAIL ? "admin" : "cliente";
      setUser({ role, email: loggedEmail });
    } catch (error) {
      // Si no existe el usuario, lo creamos
      if (error.code === "auth/user-not-found") {
        try {
          const cred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const newEmail = cred.user.email || email;
          const role = newEmail === ADMIN_EMAIL ? "admin" : "cliente";
          setUser({ role, email: newEmail });
        } catch (error2) {
          setAuthError("No se pudo crear la cuenta: " + error2.message);
        }
      } else {
        setAuthError("Error al iniciar sesión: " + error.message);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setAuthError("");
  };

  return (
    <div
      className="app"
      style={{ backgroundImage: "url(" + bgImage + ")" }}
    >
      <div className="landing-card">
        {!user && (
          <>
            <h1 className="brand">VITALUXFIT</h1>
            <p className="subtitle">Tu vitalidad, nuestro compromiso.</p>

            <h2 className="section-title">Ingresar</h2>
            <p className="helper-text">
              Usa tu correo y una contraseña. Si es tu primera vez, crearemos tu
              cuenta automaticamente.
            </p>

            {authError && <p className="error-text">{authError}</p>}

            <form onSubmit={handleSubmit} className="login-form">
              <label className="field">
                <span>Correo</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tucorreo@ejemplo.com"
                />
              </label>

              <label className="field">
                <span>Contraseña</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Minimo 6 caracteres"
                />
              </label>

              <button type="submit" className="primary-btn">
                Entrar
              </button>
            </form>
          </>
        )}

        {user && (
          <>
            <h1 className="brand">VITALUXFIT</h1>
            <p className="subtitle">
              Sesion iniciada como{" "}
              {user.role === "admin" ? "Administrador" : "Cliente"}.
            </p>

            {user.role === "admin" && (
              <div className="logged-box">
                <h2 className="section-title">Panel Admin</h2>
                <p>
                  Mas adelante aqui mostraremos el panel para gestionar minutas,
                  recetas y clientes.
                </p>
              </div>
            )}

            {user.role === "cliente" && (
              <div className="logged-box">
                <h2 className="section-title">Panel Cliente</h2>
                <p>
                  Bienvenido a tu plan Vitalux. Mas adelante aqui veras tu
                  minuta diaria y tus comidas.
                </p>
              </div>
            )}

            <button onClick={handleLogout} className="secondary-btn">
              Cerrar sesion
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
