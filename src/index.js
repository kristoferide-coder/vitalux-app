import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

// Render sin JSX para evitar el error de sintaxis
root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(App, null)
  )
);
