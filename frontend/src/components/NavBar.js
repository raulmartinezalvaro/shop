import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const endpoint = 'http://127.0.0.1:80/api';

const NavBar = ({ accessToken, setAccessToken, userID, setUserID, setUserName, setUserRole, userRole }) => {

  const handleLogout = async () => {
    if (!accessToken) {
      alert('No se encontró el token de acceso.');
      return;
    }
  
    try {
      const response = await axios.get(`${endpoint}/logout`, {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
      });
        console.log('Logout response:', response.data);
        // Limpiamos las variables en el estado global o local
        setAccessToken(null);
        setUserID(null); 
        setUserName(null); 
        setUserRole(null);

        // Limpiamos el localStorage
        localStorage.removeItem('userID');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('accessToken');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Se ha producido un error al cerrar sesión. Por favor, intenta nuevamente más tarde.');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className='navbar-title'>
        Mi tienda online
      </Link>

      {/* Si hay un accessToken : sino tenemos accessToken*/}
      <div className="navbar-btns">
        {accessToken ? (
          <>
            {/* Enlace al panel de administración solo si el usuario es admin */}
            {userRole === "admin" && (
              <Link to="/admin" className="navbar-icon">
                  <img className="icons" src="/images/admin-icon.png" alt="Admin" />
              </Link>
            )}
            <Link to={`/profile`} className="navbar-icon">
                  <img className="icons" src="/images/default-profile.png" alt="Admin" />
            </Link>
            <Link to={`/cart`} className="navbar-icon">
                  <img className="icons" src="/images/cart.png" alt="Admin" />
            </Link>
            <button onClick={handleLogout} className="navbar-btn">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-btn">Iniciar sesión</Link>
            <Link to="/register" className="navbar-btn">Crear cuenta</Link>
          </>
        )}
    </div>

    </nav>
  );
};

export default NavBar;
