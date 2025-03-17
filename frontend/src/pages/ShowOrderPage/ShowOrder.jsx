import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CircularProgress, Button, Typography, Card, CardContent, Box, Avatar } from "@mui/material";
import SideBar from "../../components/SideBar/SideBar";
import Footer from "../../components/Footer/Footer";
import jsPDF from 'jspdf';
import "react-toastify/dist/ReactToastify.css";
import "./ShowOrder.css";

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
    const logoUrl = '/images/logo.webp';
    const logo = new Image();
    logo.src = logoUrl;
  
    logo.onload = () => {
      doc.addImage(logo, 'WEBP', 10, 10, 30, 30);

      doc.setFontSize(22);
      doc.setTextColor(40, 53, 147);
      doc.text("PetNest Payment Receipt", 50, 25);
      
      doc.setLineWidth(0.5);
      doc.line(10, 40, 200, 40);
  
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      const yStart = 50;
      let yPosition = yStart;
      
      doc.setFontSize(14);
      doc.text("Customer Details:", 10, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.text(`Name: ${order.user.name || 'N/A'}`, 10, yPosition);
      yPosition += 8;
      doc.text(`Email: ${order.user.email || 'N/A'}`, 10, yPosition);
      yPosition += 15;
  
      doc.setFontSize(14);
      doc.text("Order Details:", 10, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      
      const details = [
        `Product Name: ${order.productName}`,
        `Category: ${order.category}`,
        `Quantity: ${order.quantity}`,
        `Unit Price: Tk ${(order.totalCost / order.quantity).toFixed(2)}`,
        `Total Amount: Tk ${order.totalCost.toFixed(2)}`,
        `Purchase Date: ${new Date(order.purchaseDate).toLocaleDateString()}`,
        `Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}`,
        `Transaction ID: ${order.orderId}`
      ];
  
      details.forEach((text, index) => {
        doc.text(text, 10, yPosition + (index * 8));
      });
  
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing PetNest!", 10, 280);
      doc.text("Contact: petnestweb@gmail.com | Phone: +8801859093806", 10, 285);

      doc.save(`PetNest-Payment-${order.orderId}.pdf`);
    };
  };

  return (
    <div>
      <SideBar />
      <div className="orders-page">
        <Box className="orders-content" sx={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom className="myOrder">Your Orders</Typography>
          {orders.length === 0 ? (
            <Typography variant="body1">You have no orders yet.</Typography>
          ) : (
            <Box
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              gap={2}
            >
              {orders.map((order) => (
                <Box key={order._id} width={{ xs: "100%", sm: "48%", md: "40%" }}>
                  <Card className="order-card" sx={{ padding: "16px" }}>
                    <CardContent>
                      {order.productImage && (
                        <Avatar
                          src={order.productImage}
                          alt={order.productName}
                          sx={{ width: 180, height: 180, marginBottom: 2, borderRadius: 6 }}
                        />
                      )}
                      <Typography variant="h6">{order.productName}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {order.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {order.quantity}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Total Cost: Tk {order.totalCost}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Status: {order.status}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Purchase Date: {new Date(order.purchaseDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}
                      </Typography>
                      {order.status !== "Cancelled" && (
                 <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                 <Button
                   variant="contained"
                   color="primary"
                   onClick={() => handleDownloadPaymentSlip(order)}
                   sx={{
                     backgroundColor: '#4CAF50',
                     '&:hover': {
                       backgroundColor: '#45a049',
                     },
                   }}
                 >
                   Download Payment Slip
                 </Button>
                 <Button
                   variant="contained"
                   color="error"
                   onClick={() => handleCancelOrder(order._id)}
                   sx={{
                     '&:hover': {
                       backgroundColor: '#333',
                     },
                   }}
                 >
                   Cancel Order
                 </Button>
               </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
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