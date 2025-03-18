import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AdminBar from "../../../components/AdminBar/AdminBar";
import "./HandleOrder.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
        <h3>
          <ShoppingCartIcon sx={{ mr: 1, color: '#4CAF50' }} />
          Order #{order?.orderId || ''}
        </h3>
        <span className={`status-badge ${order?.status?.toLowerCase() || ''}`}>
          {order?.status === 'Pending' && <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />}
          {order?.status === 'Shipped' && <LocalShippingIcon sx={{ fontSize: 16, mr: 0.5 }} />}
          {order?.status === 'Delivered' && <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />}
          {order?.status === 'Cancelled' && <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />}
          {order?.status || 'N/A'}
        </span>
      </div>
      <div className="admin-order-details">
        <p>
          <LocalOfferIcon />
          {order?.productId?.productName || 'N/A'}
        </p>
        <p>
          <LocalOfferIcon />
          Category: {order?.productId?.category || 'N/A'}
        </p>
        <p>
          <ShoppingCartIcon />
          Quantity: {order?.quantity || 0}
        </p>
        <p>
          <LocalOfferIcon />
          Total: ${order?.totalCost?.toFixed(2) || 0.00}
        </p>
        <p>
          <AccessTimeIcon />
          Order Date: {order?.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : 'N/A'}
        </p>
        <p>
          <AccessTimeIcon />
          Delivery Due: {order?.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
        </p>
      </div>
      <div className="admin-order-actions">
        {order?.status === "Pending" && (
          <>
            <button
              className="admin-btn shipped"
              onClick={() => handleStatusChange(order._id, "Pending", "Shipped")}
            >
              <LocalShippingIcon sx={{ fontSize: 20 }} />
              Mark as Shipped
            </button>
            <button
              className="admin-btn cancelled"
              onClick={() => handleStatusChange(order._id, "Pending", "Cancelled")}
            >
              <CancelIcon sx={{ fontSize: 20 }} />
              Cancel Order
            </button>
          </>
        )}
        {order?.status === "Shipped" && (
          <button
            className="admin-btn delivered"
            onClick={() => handleStatusChange(order._id, "Shipped", "Delivered")}
          >
            <CheckCircleIcon sx={{ fontSize: 20 }} />
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
        <Typography variant="h4" className="admin-order-head">
          Order Management
        </Typography>
        <div className="admin-orders-grid">
          <div className="admin-order-column">
            <Typography variant="h5">
              <AccessTimeIcon sx={{ mr: 1, color: '#f57c00' }} />
              Pending Orders ({groupOrdersByStatus("Pending").length})
            </Typography>
            {groupOrdersByStatus("Pending").map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <div className="admin-order-column">
            <Typography variant="h5">
              <LocalShippingIcon sx={{ mr: 1, color: '#1976d2' }} />
              Shipped Orders ({groupOrdersByStatus("Shipped").length})
            </Typography>
            {groupOrdersByStatus("Shipped").map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <div className="admin-order-column">
            <Typography variant="h5">
              <CheckCircleIcon sx={{ mr: 1, color: '#2e7d32' }} />
              Delivered Orders ({groupOrdersByStatus("Delivered").length})
            </Typography>
            {groupOrdersByStatus("Delivered").map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <div className="admin-order-column">
            <Typography variant="h5">
              <CancelIcon sx={{ mr: 1, color: '#c62828' }} />
              Cancelled Orders ({groupOrdersByStatus("Cancelled").length})
            </Typography>
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