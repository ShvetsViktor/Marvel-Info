import { createRoot } from "react-dom/client";
import App from "./components/app/App";
import React from "react";

import "./style/style.scss";


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>

);
