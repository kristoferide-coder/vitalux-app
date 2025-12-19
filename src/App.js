import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">Vitalux</div>
        <nav className="nav">
          <a href="#inicio">Inicio</a>
          <a href="#planes">Planes</a>
          <a href="#panel-cliente">Panel Cliente</a>
          <a href="#admin">Admin</a>
        </nav>
      </header>

      <main>
        {/* INICIO */}
        <section id="inicio" className="section hero">
          <h1>Vitalux funcionando 🚀</h1>
          <p className="subtitle">
            Si ves esto, el deploy resultó y ya podemos construir la app.
          </p>
          <p>
            Vitalux es tu cocina y coach en un solo lugar: comida lista, sellada
            al vacío, con macros calculados y planes hechos para que bajes
            grasa, ganes músculo y no pierdas tiempo cocinando.
          </p>
        </section>

        {/* PLANES */}
        <section id="planes" className="section">
          <h2>Planes</h2>
          <p>
            Estos textos son de ejemplo para que veas cómo se vería la
            información cuando vendas los planes desde la app.
          </p>
          <div className="cards">
            <div className="card">
              <h3>Básico</h3>
              <p>Para quienes quieren partir ordenando la semana.</p>
              <ul>
                <li>Comidas listas 3 días a la semana</li>
                <li>Macros aproximados</li>
                <li>Soporte por WhatsApp</li>
              </ul>
            </div>

            <div className="card">
              <h3>Medio</h3>
              <p>Perfecto para ver cambios visibles en 4–8 semanas.</p>
              <ul>
                <li>Comidas listas 5 días a la semana</li>
                <li>Macros personalizados</li>
                <li>1 ajuste de plan al mes</li>
              </ul>
            </div>

            <div className="card">
              <h3>Premium</h3>
              <p>Todo resuelto: solo comer, entrenar y seguir el plan.</p>
              <ul>
                <li>Comidas listas 7 días a la semana</li>
                <li>Sellado al vacío + etiquetado por macros</li>
                <li>InBody con nutricionista aliado</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PANEL CLIENTE */}
        <section id="panel-cliente" className="section">
          <h2>Panel Cliente</h2>
          <p>
            Aquí el cliente verá sus minutas, macros diarios, peso, fotos de
            progreso y recordatorios de entrega semanal.
          </p>
          <ul>
            <li>Calendario de entregas</li>
            <li>Historial de fotos y mediciones</li>
            <li>Botón para pedir la próxima semana</li>
          </ul>
          <p className="tag">Más adelante esto será 100% dinámico.</p>
        </section>

        {/* ADMIN */}
        <section id="admin" className="section">
          <h2>Admin (interno Vitalux)</h2>
          <p>
            Este será tu tablero para manejar todo el negocio: clientes,
            producción, compras y stock.
          </p>
          <ul>
            <li>Listado de clientes y tipo de plan</li>
            <li>Producción por semana (n° de platos / bolsas)</li>
            <li>Control simple de pagos y estado de cada cliente</li>
          </ul>
          <p className="tag">
            Hoy es solo maqueta, después lo conectamos a base de datos.
          </p>
        </section>

        <footer className="footer">
          Vitalux · {new Date().getFullYear()} · “Tu vitalidad, nuestro
          compromiso”.
        </footer>
      </main>
    </div>
  );
}

export default App;
