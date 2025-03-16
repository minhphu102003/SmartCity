import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import { AuthProvider } from './context/authProvider';
import { MethodProvider } from './context/methodProvider';
import { MantineProvider } from "@mantine/core"; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <MantineProvider withGlobalStyles withNormalizeCSS> 
     <AuthProvider>
      <MethodProvider>
        <App/>
      </MethodProvider>
     </AuthProvider>
     </MantineProvider>
    <ToastContainer/>
  </Router>
);

reportWebVitals();
