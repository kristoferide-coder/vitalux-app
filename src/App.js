import React, { useState } from "react";
import "./App.css";
import bgImage from "./assets/vitalux-bg.jpg";

import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [planText, setPlanText] = useState("");
  const [planEmail, setPlanEmail] = useState("");
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");
  const [clientPlan, setClientPlan] = useState("");

  // ADMIN REAL
  const ADMIN_EMAIL = "vitaluxfit@gmail.com";

  // Cargar plan de Firestore para un correo
  const loadClientPlan = async (targetEmail) => {
    if (!targetEmail) return;
    setPlanLoading(true);
    setPlanError("");

    try {
      const ref = doc(db, "plans", targetEmail.toLowerCase());
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setClientPlan(data.text || "");
      } else {
        setClientPlan("");
      }
    } catch (err) {
      console.error(err);
      setPlanError("No se pudo cargar el plan del día.");
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setPlanError("");

    if (!email || !password) {
      setAuthError("Completa correo y contraseña.");
      return;
    }

    try {
      // Intentar login
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const loggedEmail = (cred.user.email || email).toLowerCase();
      const role = loggedEmail === ADMIN_EMAIL ? "admin" : "cliente";

      setUser({ role, email: loggedEmail });
      await loadClientPlan(loggedEmail);
    } catch (error) {
      // Si no existe el usuario, lo creamos
      if (error.code === "auth/user-not-found") {
        try {
          const cred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const newEmail = (cred.user.email || email).toLowerCase();
          const role = newEmail === ADMIN_EMAIL ? "admin" : "cliente";

          setUser({ role, email: newEmail });
          await loadClientPlan(newEmail);
        } catch (error2) {
          console.error(error2);
          setAuthError("No se pudo crear la cuenta: " + error2.message);
        }
      } else {
        console.error(error);
        setAuthError("Error al iniciar sesión: " + error.message);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setAuthError("");
    setPlanText("");
    setPlanEmail("");
    setClientPlan("");
    setPlanError("");
  };

  // Guardar plan para un cliente (modo admin)
  const handleSavePlan = async (e) => {
    e.preventDefault();
    setPlanError("");

    if (!planEmail || !planText) {
      setPlanError("Correo del cliente y plan no pueden estar vacíos.");
      return;
    }

    try {
      setPlanLoading(true);
      const targetEmail = planEmail.toLowerCase().trim();

      const ref = doc(db, "plans", targetEmail);
      await setDoc(ref, {
        email: targetEmail,
        text: planText,
        updatedAt: new Date().toISOString(),
      });

      // Si el admin está guardando para sí mismo (poco probable), actualizamos también
      if (user && user.email === targetEmail) {
        setClientPlan(planText);
      }

      setPlanError("✅ Plan guardado correctamente.");
    } catch (err) {
      console.error(err);
      setPlanError("No se pudo guardar el plan: " + err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div
      className="app"
      style={{ backgroundImage: "url(" + bgImage + ")" }}
    >
      <div className="landing-card">
        {/* Vista LOGIN */}
        {!user && (
          <>
            <h1 className="brand">VITALUXFIT</h1>
            <p className="subtitle">Tu vitalidad, nuestro compromiso.</p>

            <h2 className="section-title">Ingresar</h2>
            <p className="helper-text">
              Usa tu correo y una contraseña. Si es tu primera vez, crearemos tu
              cuenta automáticamente.
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
                  placeholder="Mínimo 6 caracteres"
                />
              </label>

              <button type="submit" className="primary-btn">
                Entrar
              </button>
            </form>
          </>
        )}

        {/* Vista LOGUEADO */}
        {user && (
          <>
            <h1 className="brand">VITALUXFIT</h1>
            <p className="subtitle">
              Sesión iniciada como{" "}
              {user.role === "admin" ? "Administrador" : "Cliente"}.
            </p>

            {/* PANEL ADMIN */}
            {user.role === "admin" && (
              <div className="logged-box">
                <h2 className="section-title">Panel Admin</h2>
                <p>
                  Aquí podrás crear y actualizar el plan del día de cada
                  cliente.
                </p>

                <form onSubmit={handleSavePlan} className="plan-form">
                  <label className="field">
                    <span>Correo del cliente</span>
                    <input
                      type="email"
                      value={planEmail}
                      onChange={(e) => setPlanEmail(e.target.value)}
                      placeholder="cliente@ejemplo.com"
                    />
                  </label>

                  <label className="field">
                    <span>Plan del día</span>
                    <textarea
                      rows={6}
                      value={planText}
                      onChange={(e) => setPlanText(e.target.value)}
                      placeholder={
                        "Desayuno: ...\nAlmuerzo: ...\nCena: ..."
                      }
                    />
                  </label>

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={planLoading}
                  >
                    {planLoading ? "Guardando..." : "Guardar plan"}
                  </button>
                </form>

                {planError && <p className="error-text">{planError}</p>}
              </div>
            )}

            {/* PANEL CLIENTE */}
            {user.role === "cliente" && (
              <div className="logged-box">
                <h2 className="section-title">Plan de hoy</h2>

                {planLoading && <p>Cargando plan...</p>}

                {!planLoading && !clientPlan && (
                  <p>
                    Aún no tienes un plan cargado. Pronto verás aquí tus
                    comidas del día.
                  </p>
                )}

                {!planLoading && clientPlan && (
                  <ul className="plan-list">
                    {clientPlan
                      .split("\n")
                      .filter((line) => line.trim().length > 0)
                      .map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                  </ul>
                )}

                {planError && <p className="error-text">{planError}</p>}
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

export default App
