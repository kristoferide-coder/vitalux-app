import React, { useState, useEffect } from "react";
import "./App.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// 👉 Función para convertir el texto en días + comidas
const parseWeeklyPlan = (planStr) => {
  if (!planStr) return [];

  const DAYS = [
    "lunes",
    "martes",
    "miércoles",
    "miercoles",
    "jueves",
    "viernes",
    "sábado",
    "sabado",
    "domingo",
  ];

  const lines = planStr
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

  const result = [];
  let currentDay = null;
  let currentMeals = [];

  const pushDay = () => {
    if (currentDay) {
      result.push({
        day: currentDay,
        meals: [...currentMeals],
      });
    }
    currentDay = null;
    currentMeals = [];
  };

  lines.forEach((line) => {
    const lower = line.toLowerCase();

    const foundDay = DAYS.find((d) => lower.startsWith(d));
    if (foundDay) {
      // Nueva sección de día
      pushDay();
      // Guardamos el texto del día tal como lo escribiste (ej: "Lunes:" o "Lunes - Semana de definición")
      currentDay = line.replace(/[:\-]+$/, "");
    } else {
      currentMeals.push(line);
    }
  });

  pushDay();
  return result;
};

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [planEmail, setPlanEmail] = useState("");
  const [planText, setPlanText] = useState("");
  const [plan, setPlan] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await determineRole(firebaseUser.email);
      } else {
        setUser(null);
        setUserRole(null);
        setPlan("");
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Determinar si es ADMIN o CLIENTE
  const determineRole = async (userEmail) => {
    if (userEmail === "vitaluxfit@gmail.com") {
      setUserRole("admin");
      return;
    }

    const ref = doc(db, "clientes", userEmail);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setPlan(data.plan || "");
      setUserRole("cliente");
    } else {
      setPlan("");
      setUserRole("cliente");
    }
  };

  // 🔥 Login / Registro
  const handleLogin = async () => {
    try {
      let userCred;
      try {
        userCred = await signInWithEmailAndPassword(auth, email, password);
      } catch {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
      }

      await determineRole(userCred.user.email);
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  // 🔥 Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // 🔥 Guardar plan en Firestore
  const handleSavePlan = async () => {
    if (!planEmail || !planText) {
      alert("Completa correo y plan.");
      return;
    }

    try {
      await setDoc(doc(db, "clientes", planEmail), {
        plan: planText,
      });

      alert("Plan guardado correctamente.");
    } catch (error) {
      alert("Error guardando plan: " + error.message);
    }
  };

  // 👉 Parsear el plan a estructura semanal
  const weeklyPlan = parseWeeklyPlan(plan);

  return (
    <div className="app-container">
      {/* ===== LOGIN ===== */}
      {!user && (
        <div className="landing-card">
          <h1 className="brand-title">VITALUXFIT</h1>
          <p>Tu vitalidad, nuestro compromiso.</p>

          <h2>Ingresar</h2>
          <p className="helper-text">
            Usa tu correo y una contraseña. Si es tu primera vez, crearemos tu cuenta
            automáticamente.
          </p>

          <input
            className="input"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="button" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      )}

      {/* ===== PANEL ADMIN ===== */}
      {user && userRole === "admin" && (
        <div className="landing-card">
          <h1 className="brand-title">VITALUXFIT</h1>
          <p>Sesión iniciada como Administrador.</p>

          <h2>Panel Admin</h2>
          <p>
            Aquí podrás crear y actualizar el <strong>plan semanal</strong> de cada cliente.
          </p>
          <p className="helper-text">
            Formato sugerido:
            <br />
            Lunes:
            <br />
            Desayuno: ...
            <br />
            Almuerzo: ...
            <br />
            Cena: ...
          </p>

          <input
            className="input"
            placeholder="Correo del cliente (igual que en su login)"
            value={planEmail}
            onChange={(e) => setPlanEmail(e.target.value)}
          />

          <textarea
            className="textarea"
            placeholder={`Ejemplo:

Lunes:
Desayuno: ...
Almuerzo: ...
Cena: ...

Martes:
Desayuno: ...
Almuerzo: ...
Cena: ...
`}
            value={planText}
            onChange={(e) => setPlanText(e.target.value)}
          />

          <button className="button" onClick={handleSavePlan}>
            Guardar plan semanal
          </button>

          <button className="button secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* ===== PANEL CLIENTE CON SEMANA COMPLETA ===== */}
      {user && userRole === "cliente" && (
        <div className="landing-card client-panel">
          <h1 className="brand-title">VITALUXFIT</h1>
          <p className="session-label">Sesión iniciada como Cliente.</p>

          <h2 className="section-title">Tu semana Vitalux</h2>
          <p className="client-email">Hola, {user.email}</p>

          {weeklyPlan.length > 0 ? (
            <div className="week-grid">
              {weeklyPlan.map((day, index) => (
                <div key={index} className="plan-card day-card">
                  <div className="day-header">
                    <span className="day-badge">📅</span>
                    <h3>{day.day}</h3>
                  </div>
                  <ul className="meal-list">
                    {day.meals.map((meal, i) => (
                      <li key={i} className="meal-item">
                        {meal}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-plan">
              Aún no hay plan semanal cargado. Pronto verás aquí tus comidas 💪
            </p>
          )}

          <button className="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
