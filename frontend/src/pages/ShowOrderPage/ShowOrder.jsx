import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CircularProgress, Button, Typography, Card, CardContent, Box, Avatar } from "@mui/material";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import jsPDF from 'jspdf';
import "react-toastify/dist/ReactToastify.css";
import "./ShowOrder.css";
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const ShowOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to be logged in to view your orders.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/order/getOrder", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setOrders(data.orders);
        } else {
          toast.error(data.message || "Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/order/cancelOrder/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderId)); 
        toast.success("Order canceled successfully!");
      } else {
        toast.error(data.message || "Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Failed to cancel the order.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  const handleDownloadPaymentSlip = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    doc.setFillColor(76, 175, 80);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    const logoUrl = '/images/logo.webp';
    const logo = new Image();
    logo.src = logoUrl;
  
    logo.onload = () => {
      doc.addImage(logo, 'WEBP', margin, 10, 30, 30);

      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.setFont('Poppins', 'bold');
      doc.text("PetNest", margin + 40, 25);
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont('Poppins', 'normal');
      doc.text("Payment Receipt", margin + 40, 35);

      doc.setFillColor(255, 255, 255);
      doc.rect(margin, 45, contentWidth, pageHeight - 65, 'F');
      
      doc.setFontSize(16);
      doc.setTextColor(76, 175, 80);
      doc.setFont('Poppins', 'bold');
      doc.text(`Order ID: ${order.orderId}`, margin, 60);
      
      doc.setDrawColor(76, 175, 80);
      doc.setLineWidth(0.5);
      doc.line(margin, 65, pageWidth - margin, 65);

      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.setFont('Poppins', 'bold');
      doc.text("Customer Details", margin, 80);
      
      doc.setFontSize(12);
      doc.setFont('Poppins', 'normal');
      doc.setTextColor(74, 74, 74);
      doc.text(`Name: ${order.user.name || 'N/A'}`, margin, 90);
      doc.text(`Email: ${order.user.email || 'N/A'}`, margin, 97);
      
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.setFont('Poppins', 'bold');
      doc.text("Order Details", margin, 115);
      
      doc.setFontSize(12);
      doc.setFont('Poppins', 'normal');
      doc.setTextColor(74, 74, 74);
      
      const details = [
        `Product Name: ${order.productName}`,
        `Category: ${order.category}`,
        `Quantity: ${order.quantity}`,
        `Unit Price: Tk ${(order.totalCost / order.quantity).toFixed(2)}`,
        `Total Amount: Tk ${order.totalCost.toFixed(2)}`,
        `Purchase Date: ${new Date(order.purchaseDate).toLocaleDateString()}`,
        `Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}`,
        `Status: ${order.status}`
      ];
      
      let yPosition = 125;
      details.forEach((text) => {
        doc.text(text, margin, yPosition);
        yPosition += 7;
      });
      
      doc.setFillColor(76, 175, 80);
      doc.rect(margin, yPosition + 5, contentWidth, 20, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('Poppins', 'bold');
      doc.text(`Total Amount: Tk ${order.totalCost.toFixed(2)}`, margin + 10, yPosition + 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('Poppins', 'normal');
      doc.text("Thank you for choosing PetNest!", margin, pageHeight - 20);
      doc.text("Contact: petnestweb@gmail.com | Phone: +8801859093806", margin, pageHeight - 15);

      doc.save(`PetNest-Payment-${order.orderId}.pdf`);
    };
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  return (
    <div>
      <SideBar />
      <div className="orders-page">
        <Box className="orders-content" sx={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom className="myOrder">
            <ShoppingBagIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
            Your Orders
          </Typography>
          {orders.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
              You have no orders yet.
            </Typography>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
              gap={3}
            >
              {orders.map((order) => (
                <Card key={order._id} className="order-card">
                  <CardContent>
                    {order.productImage && (
                      <Avatar
                        src={order.productImage}
                        alt={order.productName}
                        sx={{ width: 180, height: 180, margin: '0 auto 16px' }}
                      />
                    )}
                    <Typography variant="h6">{order.productName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Category: {order.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Quantity: {order.quantity}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <LocalOfferIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Total Cost: Tk {order.totalCost}
                    </Typography>
                    <Typography variant="body2" className={`status-badge ${getStatusClass(order.status)}`}>
                      Status: {order.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Purchase Date: {new Date(order.purchaseDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4CAF50' }} />
                      Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}
                    </Typography>
                    {order.status !== "Cancelled" && (
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDownloadPaymentSlip(order)}
                          startIcon={<DownloadIcon />}
                        >
                          Download Payment Slip
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCancelOrder(order._id)}
                          startIcon={<CancelIcon />}
                        >
                          Cancel Order
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </div>
      <Footer/>
    </div>
  );
};

export default ShowOrder;