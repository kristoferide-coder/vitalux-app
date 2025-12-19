import React from "react";
import "./App.css";

function App() {
  return (
    <div className="watermark">
      <header>
        <h1>Vitalux funcionando 🚀</h1>
        <p>Si ves esto, el deploy resultó y ya podemos construir la app.</p>
      </header>

      <section>
        <h2>¿Qué es Vitalux?</h2>
        <p>
          Vitalux es tu cocina y coach en un solo lugar: comida lista una vez por
          semana, todo sellado al vacío, con macros calculados para que bajes
          grasa, ganes músculo y no pierdas tiempo cocinando.
        </p>
      </section>

      {/* aquí va todo el resto del contenido que ya tenías */}
    </div>
  );
}

export default App;
