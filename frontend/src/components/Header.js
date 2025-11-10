import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">🎮 موقع شحن العملات</Link>
        </div>
        
        <ul className="nav-links">
          <li><Link to="/">الرئيسية</Link></li>
          <li><Link to="/products">المنتجات</Link></li>
          <li><Link to="/track-order">تتبع الطلب</Link></li>
          
          {user ? (
            <>
              <li><Link to="/dashboard">لوحة التحكم</Link></li>
              <li className="user-menu">
                <span>مرحباً, {user.username}</span>
                <span className="wallet">💰 {user.wallet_balance} $</span>
                <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="login-btn">تسجيل الدخول</Link></li>
              <li><Link to="/register" className="register-btn">إنشاء حساب</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
