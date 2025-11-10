import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>شحن العملات الرقمية لألعابك المفضلة</h1>
          <p>احصل على العملات بأسعار تنافسية وبسرعة قياسية</p>
          <Link to="/products" className="cta-button">اشتري الآن</Link>
        </div>
        <div className="hero-image">
          {/* سيتم إضافة الصور لاحقاً */}
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>⚡ توصيل فوري</h3>
          <p>استلم طلبك خلال دقائق</p>
        </div>
        <div className="feature-card">
          <h3>🛡️ دفع آمن</h3>
          <p>مدفوعات مشفرة وآمنة</p>
        </div>
        <div className="feature-card">
          <h3>🎮 كل الألعاب</h3>
          <p>جميع الألعاب الشهيرة متوفرة</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
