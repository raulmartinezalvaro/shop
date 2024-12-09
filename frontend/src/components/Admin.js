import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styles/NavBar.css'

const Admin = ({ userRole } ) => {
    const navigate = useNavigate();
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/'); // Redirige a HomePage si no es administrador
        }
    }, [isAdmin, navigate]);

  return (
    <>
      <div className="main-width">
        <Link to="/admin/users-orders" className="navbar-btn">Gestión de usuarios y pedidos</Link>
        <Link to="/admin/categories-products" className="navbar-btn">Gestión de categorías y productos</Link>
      </div>
    </>
  )
}

export default Admin
