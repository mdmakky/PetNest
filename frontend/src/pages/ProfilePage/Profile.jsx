import React, { useEffect, useState } from 'react';
import SideBar from '../../components/SideBar/SideBar';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
          
        try {
            const response = await fetch('http://localhost:3000/api/user/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUserData(data);
        } catch (err) {
            console.error('Error fetching user data:', err);
        }
    };

    fetchUserData();
}, []);

  return (
    <div className="profile-page">
      <SideBar />
      <div className="profile-main">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-pic">
              <img src={userData.profileImage || '/images/user.png'} alt="Profile" />
            </div>
            <div className="profile-details">
              <h2>{userData.name || 'User Name'}</h2>
              <p className="profile-info">
                <span>Gender:</span> {userData.gender || 'N/A'}
              </p>
              <p className="profile-info">
                <span>Address:</span> {userData.address || 'N/A'}
              </p>
              <p className="profile-info">
                <span>Date of Birth:</span> {userData.dob || 'N/A'}
              </p>
              <p className="profile-info">
                <span>Phone:</span> {userData.phone || 'N/A'}
              </p>
              <p className="profile-info">
                <span>Email:</span> {userData.email || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
