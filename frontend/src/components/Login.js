// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAccessToken, setUserID, setUserName, setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:80/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { accessToken, user } = response.data;

        // Guardar los datos en localStorage
        localStorage.setItem('userID', user.id);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('accessToken', accessToken);

        // Actualizar los estados globales
        setAccessToken(accessToken);
        setUserID(user.id);
        setUserName(user.name);
        setUserRole(user.role);

        // Redirigir a la página principal
        navigate('/');
      } else {
        alert('Error al iniciar sesión. Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error al realizar el inicio de sesión:', error);
      alert('Error en la conexión. Intenta nuevamente más tarde.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{color: "#e75b3d"}}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <br/>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
          <br/>
          <label htmlFor="password">Contraseña:</label>
          <br/>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
          <br/>
          <br/>
        <button type="submit" className="navbar-btn">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
