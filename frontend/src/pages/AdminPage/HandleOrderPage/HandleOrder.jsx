import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AdminBar from "../../../components/AdminBar/AdminBar";
import "./HandleOrder.css";

const HandleOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/adminOrder/getOrder",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      setOrders(response.data?.orders || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
      
      if (error.response?.status === 401) {
        toast.error("Please login first!");
        localStorage.removeItem('token');
        navigate('/adminLogin');
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3000/api/admin/adminOrder/updateStatus/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      fetchOrders();
      Swal.fire("Success!", `Order status updated to ${newStatus}`, "success");
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire("Error!", "Failed to update order status", "error");
    }
  };

  const handleStatusChange = (orderId, currentStatus, newStatus) => {
    Swal.fire({
      title: `Change status to ${newStatus}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(orderId, newStatus);
      }
    });
  };

  const OrderCard = ({ order }) => (
    <div className="admin-order-card">
      <div className="admin-order-header">
        <h3 className="orderHead">Order {order?.orderId|| ''}</h3>
        <span className={`status-badge ${order?.status?.toLowerCase() || ''}`}>
          {order?.status || 'N/A'}
        </span>
      </div>
      <div className="admin-order-details">
        <p>Product: {order?.productId?.productName || 'N/A'}</p>
        <p>Category: {order?.productId?.category || 'N/A'}</p>
        <p>Quantity: {order?.quantity || 0}</p>
        <p>Total: ${order?.totalCost?.toFixed(2) || 0.00}</p>
        <p>Order Date: {order?.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : 'N/A'}</p>
        <p>Delivery Due: {order?.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</p>
      </div>
      <div className="admin-order-actions">
        {order?.status === "Pending" && (
          <>
            <button
              className="admin-btn shipped"
              onClick={() => handleStatusChange(order._id, "Pending", "Shipped")}
            >
              Mark as Shipped
            </button>
            <button
              className="admin-btn cancelled"
              onClick={() => handleStatusChange(order._id, "Pending", "Cancelled")}
            >
              Cancel Order
            </button>
          </>
        )}
        {order?.status === "Shipped" && (
          <button
            className="admin-btn delivered"
            onClick={() => handleStatusChange(order._id, "Shipped", "Delivered")}
          >
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  );

  const groupOrdersByStatus = (status) => 
    (orders || []).filter(order => order?.status === status);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <AdminBar />
      <div className="admin-orders-container">
        <h1 className="admin-order-head">Order Management</h1>
        <div className="admin-orders-grid">
          <div className="admin-order-column">
            <h2>Pending Orders ({groupOrdersByStatus("Pending").length})</h2>
            {groupOrdersByStatus("Pending").map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <div className="admin-order-column">
            <h2>Shipped Orders ({groupOrdersByStatus("Shipped").length})</h2>
            {groupOrdersByStatus("Shipped").map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <div className="admin-order-column">
            <h2>Delivered Orders ({groupOrdersByStatus("Delivered").length})</h2>
            {groupOrdersByStatus("Delivered").map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <div className="admin-order-column">
            <h2>Cancelled Orders ({groupOrdersByStatus("Cancelled").length})</h2>
            {groupOrdersByStatus("Cancelled").map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleOrder;