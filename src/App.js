import React, { useState, useEffect } from "react";
import "./App.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

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
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Determinar si es ADMIN o CLIENTE
  const determineRole = async (email) => {
    if (email === "vitaluxfit@gmail.com") {
      setUserRole("admin");
      return;
    }

    const ref = doc(db, "clientes", email);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setPlan(snap.data().plan);
      setUserRole("cliente");
    } else {
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

  return (
    <div className="app-container">
      {!user && (
        <div className="landing-card">
          <h1 className="brand-title">VITALUXFIT</h1>
          <p>Tu vitalidad, nuestro compromiso.</p>

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

      {/* PANEL ADMIN */}
      {user && userRole === "admin" && (
        <div className="landing-card">
          <h1 className="brand-title">VITALUXFIT</h1>
          <p>Sesión iniciada como Administrador.</p>

          <h2>Panel Admin</h2>
          <p>Crear o actualizar el plan diario del cliente.</p>

          <input
            className="input"
            placeholder="Correo del cliente"
            value={planEmail}
            onChange={(e) => setPlanEmail(e.target.value)}
          />

          <textarea
            className="textarea"
            placeholder="Escribe el plan aquí..."
            value={planText}
            onChange={(e) => setPlanText(e.target.value)}
          />

          <button className="button" onClick={handleSavePlan}>
            Guardar plan
          </button>

          <button className="button secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* PANEL CLIENTE BONITO */}
      {user && userRole === "cliente" && (
        <div className="landing-card client-panel">
          <h1 className="brand-title">VITALUXFIT</h1>
          <p className="session-label">Sesión iniciada como Cliente.</p>

          <h2 className="section-title">Tu plan de hoy</h2>
          <p className="client-email">Hola, {user.email}</p>

          <div className="plan-cards">
            {plan &&
              plan
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, index) => {
                  const lower = line.toLowerCase();
                  let tag = "✨ Detalle";

                  if (lower.startsWith("desayuno")) tag = "🥣 Desayuno";
                  else if (lower.startsWith("almuerzo")) tag = "🍗 Almuerzo";
                  else if (lower.startsWith("cena")) tag = "🍽 Cena";
                  else if (lower.startsWith("snack") || lower.startsWith("colación"))
                    tag = "🍎 Snack";

                  const cleanText = line.replace(/^[^:]+:\s*/, "");

                  return (
                    <div key={index} className="plan-card">
                      <span className="plan-tag">{tag}</span>
                      <p className="plan-text">{cleanText}</p>
                    </div>
                  );
                })}

            {!plan && (
              <p className="no-plan">
                Aún no hay plan cargado. Pronto verás aquí tus comidas 💪
              </p>
            )}
          </div>

          <button className="button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
