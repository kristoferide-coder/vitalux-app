import React, { useState } from "react";

function App() {
  const [page, setPage] = useState("inicio");

  const renderPage = () => {
    if (page === "inicio") {
      return (
        <div>
          <h1>Vitalux funcionando 🚀</h1>
          <p>Si ves esto, el deploy resultó y ya podemos construir la app.</p>

          <h2>¿Qué es Vitalux?</h2>
          <p>
            Vitalux es tu cocina y coach en un solo lugar: comida lista,
            sellada al vacío, con macros calculados y planes hechos para que
            bajes grasa, ganes músculo y no pierdas tiempo cocinando.
          </p>

          <h3>Beneficios</h3>
          <ul>
            <li>Comida lista 1 vez por semana, todo sellado al vacío.</li>
            <li>Recetas antiinflamatorias y altas en proteína.</li>
            <li>Planes ajustados a tu InBody y a tu objetivo.</li>
            <li>Sin contar calorías, solo sigues tu minuta.</li>
          </ul>

          <h3>¿Qué vas a encontrar en esta app?</h3>
          <ul>
            <li><strong>Planes:</strong> ver opciones y precios.</li>
            <li><strong>Panel Cliente:</strong> tus minutas y comidas de la semana.</li>
            <li><strong>Admin:</strong> manejo interno de clientes, semanas y producción.</li>
          </ul>
        </div>
      );
    }

    if (page === "planes") {
      return (
        <div>
          <h1>Planes Vitalux</h1>
          <p>Elige el plan que mejor se adapta a tu objetivo y presupuesto.</p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {/* Plan Básico */}
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                maxWidth: "260px",
              }}
            >
              <h2>Plan Básico</h2>
              <p>Comidas listas para 5 días a la semana.</p>
              <ul>
                <li>Desayuno + Almuerzo + Cena</li>
                <li>Recetas simples y saludables</li>
                <li>Entrega 1 vez por semana</li>
              </ul>
              <button>Quiero este plan</button>
            </div>

            {/* Plan Medio */}
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                maxWidth: "260px",
              }}
            >
              <h2>Plan Medio</h2>
              <p>Comidas listas para 6 días a la semana + snack.</p>
              <ul>
                <li>Desayuno + Almuerzo + Cena + Snack</li>
                <li>Enfoque antiinflamatorio y alto en proteína</li>
                <li>Incluye guía básica de entrenamiento</li>
              </ul>
              <button>Quiero este plan</button>
            </div>

            {/* Plan Premium */}
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                maxWidth: "260px",
              }}
            >
              <h2>Plan Premium</h2>
              <p>Transformación completa con seguimiento.</p>
              <ul>
                <li>Comidas listas para 7 días</li>
                <li>InBody con nutricionista deportivo</li>
                <li>Ajuste mensual de macros y recetas</li>
              </ul>
              <button>Quiero este plan</button>
            </div>
          </div>
        </div>
      );
    }

    if (page === "cliente") {
      return (
        <div>
          <h1>Panel Cliente</h1>
          <p>
            Aquí después vas a ver tus minutas, tus comidas de la semana y el
            detalle de porciones.
          </p>

          <h2>Resumen de la semana</h2>
          <ul>
            <li>Días cubiertos: Lunes a Viernes</li>
            <li>Objetivo: Déficit calórico / recomposición</li>
            <li>Proteína diaria: 140 g (ejemplo)</li>
          </ul>

          <h3>Próximo paso</h3>
          <p>
            Más adelante aquí mostraremos:
            <br />
            - Calendario de entregas
            <br />
            - Lista de comidas por día
            <br />- Estado de pago y próximos pedidos
          </p>
        </div>
      );
    }

    if (page === "admin") {
      return (
        <div>
          <h1>Panel Admin</h1>
          <p>
            Esta sección es solo interna de Vitalux. Desde aquí vas a manejar
            clientes, minutas y producción.
          </p>

          <h2>Qué vamos a tener acá</h2>
          <ul>
            <li>Listado de clientes y su plan.</li>
            <li>Semana actual: qué cocinar y cuántas porciones.</li>
            <li>Estado de pagos y entregas.</li>
          </ul>

          <p>
            De momento es solo maqueta, pero ya tenemos la estructura lista
            para ir conectando datos más adelante.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <strong>Vitalux</strong>

        <nav style={{ display: "flex", gap: "16px" }}>
          <button onClick={() => setPage("inicio")}>Inicio</button>
          <button onClick={() => setPage("planes")}>Planes</button>
          <button onClick={() => setPage("cliente")}>Panel Cliente</button>
          <button onClick={() => setPage("admin")}>Admin</button>
        </nav>
      </header>

      {renderPage()}
    </div>
  );
}

export default App;
