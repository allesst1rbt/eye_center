import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';

const appRoot = document.getElementById('app')!;
const root = createRoot(appRoot);
root.render(<h1>Hello, world</h1>);