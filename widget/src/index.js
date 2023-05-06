import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App";

// Find all widget divs
const widgetDivs = document.querySelectorAll(".buddhi-app-chat");

console.log(widgetDivs);
// Inject our React App into each class
widgetDivs.forEach((div) => {
  createRoot(div).render(
    <React.StrictMode>
      <App {...div.dataset} />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
