import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

// Navbar simple
function Navbar() {
  return (
    <header
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
        Vitalux
      </div>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Inicio</Link>
        <Link to="/planes">Planes</Link>
        <Link to="/clientes">Panel Cliente</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  );
}

// Página Home / Landing
function Home() {
  return (
    <div>
      <h1>Vitalux funcionando 🚀</h1>
      <p>Si ves esto, el deploy resultó y ya podemos construir la app.</p>
      <p>
        Aquí después pondremos la landing para vender los planes:
        beneficios, fotos, testimonios, etc.
      </p>
    </div>
  );
}

// Página de Planes
function Planes() {
  return (
    <div>
      <h1>Planes Vitalux</h1>
      <p>
        Aquí mostraremos Plan Básico, Medio, Premium, con precios y
        lo que incluye cada uno.
      </p>
    </div>
  );
}

// Panel de Cliente (vista muy básica por ahora)
function Clientes() {
  return (
    <div>
      <h1>Panel Cliente</h1>
      <p>
        Aquí cada cliente verá su semana, sus comidas y sus macros.
        De momento es solo un texto, después lo conectamos a base de datos.
      </p>
    </div>
  );
}

// Panel Admin (para ti)
function Admin() {
  return (
    <div>
      <h1>Panel Admin Vitalux</h1>
      <p>
        Aquí podrás administrar clientes, planes y minutas.
        Por ahora es sólo un placeholder.
      </p>
    </div>
  );
}

// App principal con Router
function App() {
  return (
    <Router>
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
        <Navbar />
        <main style={{ padding: "0 2rem 2rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
