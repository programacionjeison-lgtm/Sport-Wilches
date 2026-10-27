import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrdersProvider } from './context/OrdersContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)