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

  // CAMBIA ESTE CORREO POR EL ADMIN QUE CREASTE EN FIREBASE
  const ADMIN_EMAIL = "admin@vitalux.cl";

  const todayPlan = {
    dateLabel: "Plan de hoy",
    meals: [
      {
        id: 1,
        time: "Desayuno",
        title: "Yogurt griego + frutos rojos",
        description: "Alto en proteína, bajo en azúcar.",
        status: "ready",
        statusText: "Listo",
      },
      {
        id: 2,
        time: "Almuerzo",
        title: "Pollo Vitalux con arroz integral",
        description: "Porción controlada, ideal para energía estable.",
        status: "ready",
        statusText: "Listo",
      },
      {
        id: 3,
        time: "Cena",
        title: "Salmón al horno + ensalada verde",
        description: "Omega 3, antiinflamatorio y liviano para dormir.",
        status: "pending",
        statusText: "Pendiente",
      },
    ],
    motivation:
      "Hoy no tienes que pensar qué cocinar, solo seguir el plan. Una comida a la vez y listo 💪.",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!email || !password) {
      setAuthError("Completa correo y contraseña.");
      return;
    }

    try {
      // Intentar iniciar sesión
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const loggedEmail = cred.user.email || email;
      const role = loggedEmail === ADMIN_EMAIL ? "admin" : "cliente";
      setUser({ role, email: loggedEmail });
    } catch (error) {
      // Si no existe, creamos la cuenta
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
      style={{ backgroundImage: ⁠ url(${bgImage}) ⁠ }}
    >
      <div className="landing-card">
        {!user && (
          <>
            <h1 className="brand">VITALUXFIT</h1>
            <p className="subtitle">Tu vitalidad, nuestro compromiso.</p>

            <h2 className="section-title">Ingresar</h2>
            <p className="helper-text">
              Usa tu correo y una contraseña. Si es tu primera vez, crearemos tu
              cuenta automáticamente.
            </p>

            {authError && (
              <p className="error-text">
                {authError}
              </p>
            )}

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
                  placeholder="Mínimo 6 caracteres"
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
              Sesión iniciada como{" "}
              {user.role === "admin" ? "Administrador" : "Cliente"}.
            </p>

            {user.role === "cliente" && (
              <div className="today-box">
                <div className="today-header">
                  <h2>Hola, {user.email || "cliente Vitalux"} 👋</h2>
                  <p className="today-date">{todayPlan.dateLabel}</p>
                </div>

                <ul className="meals-list">
                  {todayPlan.meals.map((meal) => (
                    <li className="meal-item" key={meal.id}>
                      <div className="meal-time">{meal.time}</div>
                      <div className="meal-main">
                        <div className="meal-title">{meal.title}</div>
                        <div className="meal-note">{meal.description}</div>
                      </div>
                      <span
                        className={⁠ meal-badge meal-badge-${meal.status} ⁠}
                      >
                        {meal.statusText}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="motivation">{todayPlan.motivation}</p>
              </div>
            )}

            {user.role === "admin" && (
              <div className="logged-box">
                <h2 className="section-title">Panel Admin</h2>
                <p>
                  Aquí construiremos el{" "}
                  <strong>panel de administración</strong> para cargar minutas,
                  recetas y clientes desde Firebase.
                </p>
              </div>
            )}

            <button onClick={handleLogout} className="secondary-btn">
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
