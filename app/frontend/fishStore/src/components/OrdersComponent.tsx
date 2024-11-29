import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserNickFromToken } from '../utils/utility';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
}

interface Order {
  id: number;
  totalPrice: number;
  orderProducts: OrderItem[];
  status: number | null; // allow for null statuses
  date: string;
  email:string;
}


const OrdersComponent: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('');


  const viewItems = (orderId: number) => {
    navigate(`/order/${orderId}/items`, { state: { orderId } });
  };

  
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const userLogin = getUserNickFromToken();

    if (!token || !userLogin) {
      setError('You must be logged in to view your orders.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/orders/${userLogin}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Your Orders</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!orders.length && !error ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.date + 'Z').toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.status === null
                      ? 'Unknown'
                      : order.status === 0
                      ? 'In Progress'
                      : order.status === 1
                      ? 'Finished'
                      : order.status}
                  </td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => viewItems(order.id)}
                    >
                      View Items
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersComponent;
