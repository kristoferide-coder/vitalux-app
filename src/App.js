import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [clientEmail, setClientEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [planCliente, setPlanCliente] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // 🔥 Detectar sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (usuario) => {
      if (usuario) {
        setUser(usuario);

        if (usuario.email === "vitaluxfit@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          obtenerPlanCliente(usuario.email);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  // 🔐 Login
  async function login() {
    setMensaje("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        // Si no existe → lo creamos
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        setMensaje("Error al iniciar sesión");
      }
    }
  }

  // 🔓 Logout
  async function logout() {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  }

  // 🧑‍🍳 Guardar plan para cliente
  async function guardarPlan() {
    setMensaje("Guardando...");
    try {
      await setDoc(doc(db, "clients", clientEmail), {
        plan: plan,
      });
      setMensaje("Plan guardado correctamente.");
    } catch (err) {
      setMensaje("Error al guardar el plan.");
    }
  }

  // 👤 Cliente obtiene su plan
  async function obtenerPlanCliente(emailUser) {
    setLoadingPlan(true);
    const ref = doc(db, "clients", emailUser);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setPlanCliente(snap.data().plan);
    } else {
      setPlanCliente("");
    }

    setLoadingPlan(false);
  }

  // 🧾 Ordenar plan en tarjetitas bonitas
  const seccionesPlan = useMemo(() => {
    if (!planCliente) return [];

    const resultado = [];

    planCliente.split("\n").forEach((linea) => {
      const texto = linea.trim();
      if (!texto) return;

      const [tituloBruto, ...resto] = texto.split(":");
      if (!resto.length) {
        resultado.push({ titulo: "", texto });
      } else {
        resultado.push({
          titulo: tituloBruto.trim(),
          texto: resto.join(":").trim(),
        });
      }
    });

    return resultado;
  }, [planCliente]);

  return (
    <div className="app-container">
      {!user && (
        <div className="login-box">
          <h1>VITALUXFIT</h1>
          <p>Tu vitalidad, nuestro compromiso.</p>

          {mensaje && <p>{mensaje}</p>}

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Entrar</button>
        </div>
      )}

      {user && isAdmin && (
        <div className="panel-box">
          <h1>VITALUXFIT</h1>
          <p>Sesión iniciada como Administrador.</p>

          <h2>Panel Admin</h2>
          <p>
            Aquí podrás crear y actualizar el plan del día de cada cliente.
          </p>

          <input
            type="email"
            placeholder="Correo del cliente"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />

          <textarea
            placeholder="Plan del día"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          ></textarea>

          <button onClick={guardarPlan}>Guardar plan</button>

          {mensaje && <p>{mensaje}</p>}

          <button onClick={logout}>Cerrar sesión</button>
        </div>
      )}

      {user && !isAdmin && (
        <div className="panel-box">
          <h1>VITALUXFIT</h1>
          <p>Sesión iniciada como Cliente.</p>

          <h2>Tu plan de hoy</h2>

          <p>Hola, {user.email}</p>

          {loadingPlan && <p>Cargando tu plan...</p>}

          {!loadingPlan && !planCliente && (
            <p>
              Aún no tienes un plan asignado. Cuando tu coach lo suba,
              aparecerá aquí.
            </p>
          )}

          {!loadingPlan && planCliente && (
            <div className="plan-container">
              {seccionesPlan.map((item, index) => (
                <div key={index} className="plan-item">
                  {item.titulo && <h3>{item.titulo}</h3>}
                  <p>{item.texto}</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={logout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}

export default App;
