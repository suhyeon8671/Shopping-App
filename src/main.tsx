
import React from 'react';
import ReactDOM from 'react-dom/client';
import CartProvider from './context/CartProvider';
import App from './App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
  </React.StrictMode>
);
