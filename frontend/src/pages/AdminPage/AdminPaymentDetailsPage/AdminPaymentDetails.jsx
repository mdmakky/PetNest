import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TableSortLabel,
  Box,
  styled
} from '@mui/material';
import moment from 'moment';
import AdminBar from "../../../components/AdminBar/AdminBar";
import "./AdminPaymentDetails.css";

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
}));

const ResponsiveTable = styled(TableContainer)(({ theme }) => ({
  overflowX: 'auto',
  borderRadius: theme.shape.borderRadius,
}));

const mobileHidden = {
  display: { xs: 'none', sm: 'table-cell' }
};

const AdminPaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login first.");
        navigate("/adminLogin");
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/admin/adminPaymentDetails/getPayment', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
          navigate("/adminLogin");
          return;
        }

        const data = await response.json();
        if (data.success) {
          setPayments(data.payments);
        } else {
          toast.error(data.message || "Failed to fetch payments");
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  const handleSort = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setOrder(newOrder);
    setPayments([...payments].sort((a, b) => 
      newOrder === 'asc' 
        ? moment(a.purchasedDate) - moment(b.purchasedDate)
        : moment(b.purchasedDate) - moment(a.purchasedDate)
    ));
  };

  if (loading) {
    return (
      <Box className="loading-spinner">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="admin-payment-container">
      <AdminBar />
      <StyledContainer maxWidth="lg">
        <Typography variant="h4" gutterBottom className="admin-payment-title">
          Payment Transactions
        </Typography>

        <ResponsiveTable component={Paper} className="table-container">
          <Table>
            <TableHead className="styled-table-header">
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell sx={mobileHidden}>Product</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>
                  <TableSortLabel
                    active
                    direction={order}
                    onClick={handleSort}
                    className="clickable-cell"
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={mobileHidden} className="mobile-hidden">Seller</TableCell>
                <TableCell sx={mobileHidden} className="mobile-hidden">Transaction ID</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id} hover className="table-row">
                  <TableCell>
                    <Typography fontWeight="500" className="responsive-text">
                      {payment.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {payment.quantity}
                    </Typography>
                  </TableCell>

                  <TableCell sx={mobileHidden} className="mobile-hidden">
                    <Typography className="responsive-text">
                      {payment.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {payment.category}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography className="amount-cell">
                      ৳{payment.totalAmount.toLocaleString()}
                    </Typography>
                    <Typography className="unit-price">
                      ৳{(payment.price).toLocaleString()}/unit
                    </Typography>
                  </TableCell>

                  <TableCell className="date-cell">
                    <Typography className="responsive-text">
                      {moment(payment.purchasedDate).format('MMM D, YYYY')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moment(payment.purchasedDate).format('h:mm A')}
                    </Typography>
                  </TableCell>

                  <TableCell sx={mobileHidden} className="mobile-hidden">
                    <Typography className="responsive-text">
                      {payment.sellerName}
                    </Typography>
                  </TableCell>

                  <TableCell sx={mobileHidden} className="mobile-hidden">
                    <Typography variant="body2" className="transaction-id">
                      {payment.transactionId}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResponsiveTable>

        {payments.length === 0 && !loading && (
          <Box className="no-records">
            <Typography variant="h6" color="textSecondary">
              📭 No payment records found
            </Typography>
          </Box>
        )}
      </StyledContainer>
    </div>
  );
};

export default AdminPaymentDetails;