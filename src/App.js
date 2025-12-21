import React, { useState, useEffect } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// 🔹 Correo que será admin en Vitalux
const ADMIN_EMAIL = "vitaluxfit@gmail.com";

// 🔹 Componente principal
function App() {
  const [user, setUser] = useState(null); // { email, role }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      let cred;

      // Intentar iniciar sesión
      try {
        cred = await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        // Si el usuario no existe, lo creamos
        if (err.code === "auth/user-not-found") {
          cred = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }

      const loggedEmail = cred.user.email;
      const role = loggedEmail === ADMIN_EMAIL ? "admin" : "cliente";

      setUser({ email: loggedEmail, role });
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al iniciar sesión: " + (err.message || ""));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 🔹 Vista según rol
  if (!user) {
    return (
      <div className="app">
        <div className="landing-card">
          <h1>VITALUXFIT</h1>
          <p>Tu vitalidad, nuestro compromiso.</p>

          <h2>Ingresar</h2>
          <p>
            Usa tu correo y una contraseña. Si es tu primera vez, crearemos tu
            cuenta automáticamente.
          </p>

          {errorMsg && <p style={{ color: "#ffb3b3" }}>{errorMsg}</p>}

          <form onSubmit={handleLogin}>
            <label>
              Correo
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tucorreo@ejemplo.com"
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>

            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // Admin
  if (user.role === "admin") {
    return <AdminPanel user={user} onLogout={handleLogout} />;
  }

  // Cliente
  return <ClientPanel user={user} onLogout={handleLogout} />;
}

// 🔹 Panel Admin: guarda plan del día en Firestore
function AdminPanel({ user, onLogout }) {
  const [clientEmail, setClientEmail] = useState("");
  const [planText, setPlanText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");
    setErrorMsg("");

    try {
      const emailKey = clientEmail.trim().toLowerCase();

      if (!emailKey) {
        setErrorMsg("Debes ingresar un correo de cliente.");
        setSaving(false);
        return;
      }

      await setDoc(
        doc(db, "clientes", emailKey),
        { plan: planText },
        { merge: true }
      );

      setSavedMsg("✅ Plan guardado correctamente.");
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Error al guardar el plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <div className="landing-card">
        <h1>VITALUXFIT</h1>
        <p>Sesión iniciada como Administrador.</p>

        <h2>Panel Admin</h2>
        <p>
          Aquí podrás crear y actualizar el plan del día de cada cliente.
        </p>

        {errorMsg && <p style={{ color: "#ffb3b3" }}>{errorMsg}</p>}
        {savedMsg && <p style={{ color: "#b3ffb3" }}>{savedMsg}</p>}

        <form onSubmit={handleSave}>
          <label>
            Correo del cliente
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
              required
            />
          </label>

          <label>
            Plan del día
            <textarea
              rows={6}
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              placeholder="Desayuno: ...&#10;Almuerzo: ...&#10;Cena: ..."
              required
            />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar plan"}
          </button>
        </form>

        <button className="secondary" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// 🔹 Panel Cliente: lee plan de Firestore y lo muestra
function ClientPanel({ user, onLogout }) {
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const ref = doc(db, "clientes", user.email.toLowerCase());
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setPlan(data.plan || "");
        } else {
          setPlan("");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("No pudimos cargar tu plan de hoy.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user.email]);

  return (
    <div className="app">
      <div className="landing-card">
        <h1>VITALUXFIT</h1>
        <p>Sesión iniciada como Cliente.</p>

        <h2>Tu plan de hoy</h2>
        <p>Hola, {user.email}</p>

        {loading && <p>Cargando tu plan...</p>}
        {errorMsg && <p style={{ color: "#ffb3b3" }}>{errorMsg}</p>}

        {!loading && !errorMsg && (
          <>
            {plan ? (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  textAlign: "left",
                  marginTop: "12px",
                }}
              >
                {plan}
              </pre>
            ) : (
              <p>
                Aún no hay un plan asignado para hoy. Avísale a tu coach para
                que lo cargue. 💪
              </p>
            )}
          </>
        )}

        <button className="secondary" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default App;
