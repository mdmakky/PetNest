import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CircularProgress, Button, Typography, Card, CardContent, Box, Avatar } from "@mui/material";
import SideBar from "../../components/SideBar/SideBar";
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
                  <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleCancelOrder(order._id)}
                  sx={{
                    marginTop: "10px",
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                >
                  Cancel Order
                </Button>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default ShowOrder;
