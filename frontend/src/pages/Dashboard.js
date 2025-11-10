import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      setOrders(response.data.recent_orders || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'pending': return 'قيد المعالجة';
      case 'failed': return 'فاشل';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>لوحة التحكم</h1>
        
        <div className="dashboard-grid">
          {/* بطاقة معلومات المستخدم */}
          <div className="dashboard-card user-info">
            <h3>معلومات الحساب</h3>
            <div className="user-details">
              <p><strong>اسم المستخدم:</strong> {user?.username}</p>
              <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
              <p><strong>رصيد المحفظة:</strong> 
                <span className="wallet-balance"> {user?.wallet_balance} $</span>
              </p>
              <p><strong>كود الإحالة:</strong> {user?.referral_code}</p>
            </div>
          </div>

          {/* بطاقة الطلبات الحديثة */}
          <div className="dashboard-card recent-orders">
            <h3>الطلبات الحديثة</h3>
            {orders.length === 0 ? (
              <p className="no-orders">لا توجد طلبات حديثة</p>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <h4>{order.product_name}</h4>
                      <p>اللعبة: {order.game}</p>
                      <p>المعرف: {order.player_id}</p>
                      <p>السعر: {order.total_price} $</p>
                    </div>
                    <div className={`order-status ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* بطاقة الإحصائيات */}
          <div className="dashboard-card stats">
            <h3>الإحصائيات</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <h4>إجمالي الطلبات</h4>
                <p className="stat-number">{orders.length}</p>
              </div>
              <div className="stat-item">
                <h4>الطلبات الناجحة</h4>
                <p className="stat-number">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="stat-item">
                <h4>معدل النجاح</h4>
                <p className="stat-number">
                  {orders.length > 0 
                    ? Math.round((orders.filter(o => o.status === 'completed').length / orders.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
