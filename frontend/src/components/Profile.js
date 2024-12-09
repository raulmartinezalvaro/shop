import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

const Profile = ({ accessToken, userID }) => {
    const navigate = useNavigate();
    
    // En caso de no tener accessToken, redirige a la página de inicio
    useEffect(() => {
        if (!accessToken) {
            navigate('/');
        }
    }, [accessToken, userID, navigate]);

    return (
    <>
        <div className="main-width">
            <div className="button-grid">
                <div className="button-card">
                    <Link to={`/update-profile/${userID}`} className="button-card-link">
                        <img src="/images/profile.png" className="button-image"/>
                        <h3 style={{color: "#e75b3d"}} >Modificar perfil</h3>
                    </Link>
                </div>
                <div className="button-card">
                    <Link to={`/orders/${userID}`} className="button-card-link">
                        <img src="/images/orders.png" className="button-image"/>
                        <h3 style={{color: "#e75b3d"}} >Mis pedidos</h3>
                    </Link>
                </div>
            </div>
        </div>
    </>
    );
};

export default Profile;
