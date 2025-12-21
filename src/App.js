import React, { useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null); // { email, role: "admin" | "cliente" }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Admin
  const [clientEmail, setClientEmail] = useState("");
  const [planText, setPlanText] = useState("");
  const [saving, setSaving] = useState(false);

  // Cliente
  const [clientPlan, setClientPlan] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [message, setMessage] = useState(""); // mensajes de éxito
  const [error, setError] = useState(""); // mensajes de error

  const ADMIN_EMAIL = "vitaluxfit@gmail.com";

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // Intentar iniciar sesión
      let cred;
      try {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        // Si el usuario no existe, lo creamos como cliente
        if (err.code === "auth/user-not-found") {
          cred = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }

      const emailLower = email.toLowerCase();
      const role = emailLower === ADMIN_EMAIL ? "admin" : "cliente";

      setUser({ email: emailLower, role });

      // Si es cliente, cargar su plan desde Firestore
      if (role === "cliente") {
        setLoadingPlan(true);
        const ref = doc(db, "clients", emailLower);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setClientPlan(data.plan || "Aún no tienes un plan cargado para hoy.");
        } else {
          setClientPlan("Aún no tienes un plan cargado para hoy.");
        }
        setLoadingPlan(false);
      }

      // Limpiar campos de login
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión: " + (err.message || ""));
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    setUser(null);
    setClientEmail("");
    setPlanText("");
    setClientPlan("");
    setMessage("");
    setError("");
  };

  // 💾 ADMIN: GUARDAR PLAN EN FIRESTORE
  const handleSavePlan = async () => {
    setError("");
    setMessage("");

    const emailTrimmed = clientEmail.trim().toLowerCase();

    if (!emailTrimmed) {
      setError("Debes escribir el correo del cliente.");
      return;
    }

    if (!planText.trim()) {
      setError("El plan del día no puede estar vacío.");
      return;
    }

    try {
      setSaving(true);

      const ref = doc(db, "clients", emailTrimmed);
      await setDoc(ref, {
        plan: planText.trim(),
        updatedAt: new Date().toISOString(),
      });

      setSaving(false);
      setMessage("✅ Plan guardado correctamente.");
    } catch (err) {
      console.error(err);
      setSaving(false);
      setError("Error al guardar el plan: " + (err.message || ""));
    }
  };

  // 🔁 Render según estado
  // 1) Si NO hay usuario → pantalla de login
  if (!user) {
    return (
      <div className="app">
        <div className="landing-card">
          <h1>VITALUXFIT</h1>
          <p>Tu vitalidad, nuestro compromiso.</p>

          <h2>Ingresar</h2>
          <p style={{ fontSize: "0.9rem", marginBottom: "12px" }}>
            Usa tu correo y una contraseña. Si es tu primera vez, crearemos tu
            cuenta automáticamente.
          </p>

          {error && (
            <p style={{ color: "#ffb3b3", fontSize: "0.9rem" }}>{error}</p>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ textAlign: "left", fontSize: "0.9rem" }}>
              Correo
            </label>
            <input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label style={{ textAlign: "left", fontSize: "0.9rem" }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="primary-button">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2) Si es ADMIN → panel admin
  if (user.role === "admin") {
    return (
      <div className="app">
        <div className="landing-card">
          <h1>VITALUXFIT</h1>
          <p>Sesión iniciada como Administrador.</p>

          <h2>Panel Admin</h2>
          <p style={{ fontSize: "0.9rem", marginBottom: "12px" }}>
            Aquí podrás crear y actualizar el plan del día de cada cliente.
          </p>

          {error && (
            <p style={{ color: "#ffb3b3", fontSize: "0.9rem" }}>{error}</p>
          )}
          {message && (
            <p style={{ color: "#a5ffb3", fontSize: "0.9rem" }}>{message}</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ textAlign: "left", fontSize: "0.9rem" }}>
              Correo del cliente
            </label>
            <input
              type="email"
              placeholder="cliente@ejemplo.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />

            <label style={{ textAlign: "left", fontSize: "0.9rem" }}>
              Plan del día
            </label>
            <textarea
              rows={6}
              placeholder={⁠ Desayuno: ...\nAlmuerzo: ...\nCena: ... ⁠}
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
            />

            <button
              type="button"
              className="primary-button"
              onClick={handleSavePlan}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar plan"}
            </button>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={handleLogout}
            style={{ marginTop: "16px" }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // 3) Si es CLIENTE → ver su plan del día
  return (
    <div className="app">
      <div className="landing-card">
        <h1>VITALUXFIT</h1>
        <p>Sesión iniciada como Cliente.</p>

        <h2>
          Hola, {user.email}{" "}
          <span role="img" aria-label="saludo">
            👋
          </span>
        </h2>

        <h3>Plan de hoy</h3>

        {loadingPlan ? (
          <p>Cargando tu plan...</p>
        ) : (
          <p style={{ whiteSpace: "pre-line" }}>{clientPlan}</p>
        )}

        <p style={{ marginTop: "16px", fontSize: "0.9rem" }}>
          Hoy no tienes que pensar qué cocinar, solo seguir el plan.  
          Una comida a la vez y listo 💪
        </p>

        <button
          type="button"
          className="secondary-button"
          onClick={handleLogout}
          style={{ marginTop: "16px" }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default App;
