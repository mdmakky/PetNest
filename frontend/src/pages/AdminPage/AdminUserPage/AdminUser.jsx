import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  CircularProgress,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AdminBar from "../../../components/AdminBar/AdminBar";
import "./AdminUser.css";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/adminUser/getUser', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${email}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/api/admin/adminUser/removeUser/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          Swal.fire(
            'Deleted!',
            'User has been deleted.',
            'success'
          );
          
          fetchUsers();
        } catch (error) {
          toast.error('Failed to delete user');
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <div className="admin-user-container">
      <AdminBar />
      
      <div className="user-management-container">
        <Typography className="user-management-title" variant="h4" gutterBottom>
          User Management
        </Typography>
        
        <TableContainer component={Paper} className="user-table">
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="header-cell">Name</TableCell>
                <TableCell className="header-cell">Email</TableCell>
                <TableCell className="header-cell">Verified</TableCell>
                <TableCell className="header-cell">Profile Complete</TableCell>
                <TableCell className="header-cell">Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} className="table-row">
                  <TableCell className="body-cell">{user.name || 'N/A'}</TableCell>
                  <TableCell className="body-cell">{user.email}</TableCell>
                  <TableCell className="body-cell">
                    <span className={`status-badge ${user.isVerified ? 'verified' : 'not-verified'}`}>
                      {user.isVerified ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell className="body-cell">
                    <span className={`status-badge ${user.profileComplete ? 'complete' : 'incomplete'}`}>
                      {user.profileComplete ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell className="body-cell">
                    <IconButton 
                      className="delete-button"
                      onClick={() => handleDeleteUser(user._id, user.email)}
                    >
                      <DeleteIcon className="delete-icon" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AdminUser;