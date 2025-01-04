import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../../components/NavBar/NavBar';
import { CircularProgress } from "@mui/material";
import './Home.css';

const Home = () => {
    return (
        <div><NavBar/></div>
    )
}

export default Home;