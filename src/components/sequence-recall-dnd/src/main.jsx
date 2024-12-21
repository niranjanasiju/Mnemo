import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';  // Adjust path if necessary
import './styles.css';  // Import global styles (if any)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
