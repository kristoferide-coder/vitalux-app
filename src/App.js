import React, { useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Súper simple y temporal:
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
    <div className="app">
      <div className="landing-card">
        {!user && (
          <>
            <h1 className="brand">VitaluxFit</h1>
            <p className="subtitle">Tu vitalidad, nuestro compromiso.</p>

            <h2 className="section-title">Ingresar</h2>
            <p className="helper-text">
              Si usas el código <strong>vitaluxadmin</strong> entrarás como
              <strong> administrador</strong>. Cualquier otro código entra como
              <strong> cliente</strong>. Es solo una prueba por ahora.
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
                  placeholder="vitaluxadmin o lo que quieras"
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
            <h1 className="brand">VitaluxFit</h1>
            <p className="subtitle">
              Sesión iniciada como{" "}
              {user.role === "admin" ? "Administrador" : "Cliente"}.
            </p>

            {user.role === "cliente" && (
              <div className="logged-box">
                <h2 className="section-title">Hola, {user.email}</h2>
                <p>
                  Aquí después irá tu pantalla{" "}
                  <strong>“Hoy te toca”</strong> con las comidas del día.
                </p>
              </div>
            )}

            {user.role === "admin" && (
              <div className="logged-box">
                <h2 className="section-title">Panel Admin</h2>
                <p>
                  Aquí construiremos el <strong>panel de administración</strong>{" "}
                  para cargar minutas, recetas y clientes.
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
