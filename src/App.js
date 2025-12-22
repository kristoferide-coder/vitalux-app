import React, { useState, useEffect } from "react";
import "./App.css";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import "./firebase";

const weekMenu = {
  lunes: {
    desayuno: "Omelette de tomate y queso",
    almuerzo: "Zucchini de carne",
    cena: "Alitas de pollo con ensalada de lechuga y palta",
  },
  martes: {
    desayuno: "Avena + berries",
    almuerzo: "Pollo + arroz + ensalada",
    cena: "Salmón + ensalada verde",
  },
  miércoles: {
    desayuno: "Pan integral + huevo",
    almuerzo: "Pastel de papas light",
    cena: "Merluza + verduras salteadas",
  },
  jueves: {
    desayuno: "Yogurt + frutas",
    almuerzo: "Carne + puré rústico",
    cena: "Sopa de verduras + pollo",
  },
  viernes: {
    desayuno: "Huevos revueltos + pan integral",
    almuerzo: "Pasta integral + pollo",
    cena: "Tortilla de verduras",
  },
  sábado: {
    desayuno: "Avena + mantequilla maní",
    almuerzo: "Opcional libre controlado",
    cena: "Proteína + ensalada",
  },
  domingo: {
    desayuno: "Opcional libre controlado",
    almuerzo: "Asado balanceado",
    cena: "Ligera + proteína",
  },
};

const daysOrder = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

export default function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState("lunes");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);

      // Detectar día actual
      const today = new Date().toLocaleDateString("es-CL", { weekday: "long" }).toLowerCase();
      if (daysOrder.includes(today)) setSelectedDay(today);
    });

    return () => unsub();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="App">
      <div className="app-shell">
        {/* -------- HEADER -------- */}
        <header className="app-header">
          <div className="logo-circle">V</div>

          <div className="brand-text">
            <span className="brand-name">VitaluxFit</span>
            <span className="brand-tagline">Tu vitalidad, nuestro compromiso</span>
          </div>

          {user && <div className="user-chip">Cliente</div>}
        </header>

        {/* -------- CUERPO -------- */}
        <div className="app-body">

          {!user ? (
            <>
              <h1>Bienvenido</h1>
              <p>Inicia sesión para ver tu planificación Vitalux.</p>

              <button onClick={login}>
                Iniciar sesión con Google
              </button>
            </>
          ) : (
            <>
              <h1>Sesión iniciada</h1>
              <h2>Tu semana Vitalux</h2>

              <p>Hola, <strong>{user.email}</strong></p>

              {/* ---- Layout semana ---- */}
              <div className="week-layout">

                {/* Sidebar días */}
                <div className="week-sidebar">
                  {daysOrder.map((day) => (
                    <button
                      key={day}
                      className={`week-day-button ${
                        selectedDay === day ? "week-day-button--active" : ""
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Panel del día */}
                <div className="week-main">
                  <h3>{selectedDay}</h3>

                  <div className="day-card">
                    <p><strong>Desayuno:</strong> {weekMenu[selectedDay].desayuno}</p>
                    <p><strong>Almuerzo:</strong> {weekMenu[selectedDay].almuerzo}</p>
                    <p><strong>Cena:</strong> {weekMenu[selectedDay].cena}</p>
                  </div>
                </div>
              </div>

              <button onClick={logout} style={{ marginTop: 18 }}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
