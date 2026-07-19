// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
// createRoot(document.getElementById("root")).render(
//   /*#__PURE__*/ _jsxDEV(
//     StrictMode,
//     {
//       children: /*#__PURE__*/ _jsxDEV(App, {}, void 0, false),
//     },
//     void 0,
//     false,
//   ),
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);