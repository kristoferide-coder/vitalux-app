import React, { useState } from "react";
import "./App.css";
import bgImage from "./assets/vitalux-bg.jpg";
import { db } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  // Plan "falso" de ejemplo para HOY (luego lo sacamos de base de datos)
  const todayPlan = {
    dateLabel: "Plan de hoy",
    meals: [
      {
        id: 1,
        time: "Desayuno",
        title: "Yogurt griego + frutos rojos",
        description: "Alto en proteína, bajo en azúcar.",
        status: "ready",
        statusText: "Listo"
      },
      {
        id: 2,
        time: "Almuerzo",
        title: "Pollo Vitalux con arroz integral",
        description: "Porción controlada, ideal para energía estable.",
        status: "ready",
        statusText: "Listo"
      },
      {
        id: 3,
        time: "Cena",
        title: "Salmón al horno + ensalada verde",
        description: "Omega 3, antiinflamatorio y liviano para dormir.",
        status: "pending",
        statusText: "Pendiente"
      }
    ],
    motivation:
      "Hoy no tienes que pensar qué cocinar, solo seguir el plan. Una comida a la vez y listo 💪."
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporal:
    // si el código es "vitaluxadmin" => admin, si no => cliente
    if (code === "vitaluxadmin") {
      setUser({ role: "admin", email });
    } else {
      setUser({ role: "cliente", email });
    }

    setCode("");
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setCode("");
  };

  return (
    <div
      className="app"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="landing-card">
        {!user && (
          <>
            <h1 className="brand">VITALUXFIT</h1>
            <p className="subtitle">Tu vitalidad, nuestro compromiso.</p>

            <h2 className="section-title">Ingresar</h2>
            <p className="helper-text">
              Si usas el código <strong>vitaluxadmin</strong> entrarás como
              <strong> administrador</strong>. Cualquier otro código entra como
              <strong> cliente</strong>. Esto es solo temporal mientras
              desarrollamos el sistema real.
            </p>

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
                <span>Código de acceso</span>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="vitaluxadmin o cualquier código"
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
                        className={`meal-badge meal-badge-${meal.status}`}
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
                  recetas y clientes.
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
