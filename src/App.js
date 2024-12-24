import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './Components/ProductList';
import Cart from './Components/Cart';
import OrderConfirmation from './Components/OrderConfirmation';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<ProductList />} />

          {/* Other Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
