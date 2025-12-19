import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">Vitaluxfit</div>
        <nav className="nav">
          <a href="#inicio">Inicio</a>
          <a href="#planes">Planes</a>
          <a href="#panel-cliente">Panel Cliente</a>
          <a href="#admin">Admin</a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="hero">
          <h1>Vitalux funcionando 🚀</h1>
          <p>Si ves esto, el deploy resultó y ya podemos construir la app.</p>
          <p className="hero-subtitle">
            Comida lista, sellada al vacío y con macros calculados para que
            bajes grasa, ganes músculo y no pierdas tiempo cocinando.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#planes">
              Ver planes
            </a>
            <a
              className="btn btn-outline"
              href="https://wa.me/56965235990"
              target="_blank"
              rel="noreferrer"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </section>

        <section id="que-es" className="section">
          <h2>¿Qué es Vitalux?</h2>
          <p>
            Vitalux es tu cocina y coach en un solo lugar: comida lista una vez
            por semana, todo sellado al vacío, con planes hechos a medida.
          </p>
        </section>

        <section id="planes" className="section">
          <h2>Planes</h2>
          <div className="cards">
            <div className="card">
              <h3>Básico</h3>
              <ul>
                <li>Comidas listas 3 días a la semana</li>
                <li>Macros aproximados</li>
                <li>Soporte por WhatsApp</li>
              </ul>
            </div>

            <div className="card">
              <h3>Medio</h3>
              <ul>
                <li>Comidas listas 5 días a la semana</li>
                <li>Macros personalizados</li>
                <li>1 ajuste de plan al mes</li>
              </ul>
            </div>

            <div className="card">
              <h3>Premium</h3>
              <ul>
                <li>Comidas listas 7 días a la semana</li>
                <li>Sellado al vacío + etiquetado por macros</li>
                <li>InBody con nutricionista aliado</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="panel-cliente" className="section">
          <h2>Panel Cliente</h2>
          <p>
            Aquí el cliente verá sus minutas, macros diarios, peso, fotos de
            progreso y recordatorios de entrega semanal.
          </p>
          <ul>
            <li>Calendario de entregas</li>
            <li>Historial de fotos y mediciones</li>
            <li>Botón para pedir la minuta de la semana</li>
          </ul>
        </section>

        <section id="admin" className="section">
          <h2>Admin (interno Vitalux)</h2>
          <p>
            Este será tu tablero para manejar todo el negocio: clientes,
            producción, compras y stock.
          </p>
          <ul>
            <li>Listado de clientes y tipo de plan</li>
            <li>Producción por semana (nº de platos / bolsas)</li>
            <li>Control simple de pagos y estado de cada cliente</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        Vitalux · 2025 · <span>“Tu vitalidad, nuestro compromiso”</span>
      </footer>
    </div>
  );
}

export default App;
         
