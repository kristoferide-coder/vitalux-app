import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="landing-card">
        <h1 className="brand">VitaluxFit</h1>
        <p className="subtitle">Tu vitalidad, nuestro compromiso.</p>

        <p className="tagline">
          Planes de alimentación y entrenamiento diseñados para ti.
        </p>

        <a
          className="whatsapp-btn"
          href="https://wa.me/569XXXXXXXX"
          target="_blank"
          rel="noreferrer"
        >
          Quiero mi plan Vitalux
        </a>

        <p className="contact-note">
          También puedes escribirnos directo a WhatsApp para más información.
        </p>
      </div>
    </div>
  );
}

export default App;
