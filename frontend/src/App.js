import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="App" dir="rtl">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track-order" element={<TrackOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
