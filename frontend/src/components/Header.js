import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">موقع شحن العملات</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">الرئيسية</Link></li>
          <li><Link to="/products">المنتجات</Link></li>
          <li><Link to="/track-order">تتبع الطلب</Link></li>
          <li><button className="login-btn">تسجيل الدخول</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
