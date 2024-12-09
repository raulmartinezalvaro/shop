import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const endpoint = 'http://127.0.0.1:80/api';


const Register = ({ setAccessToken, setUserID, setUserName }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [surname2, setSurname2] = useState('');
    const [address, setAddress] = useState('');
    const [CP, setCP] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    if (password !== passwordConfirmation) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const response = await axios.post(`${endpoint}/register`, {
            name,
            surname,
            surname2,
            address,
            CP,
            phone_number: phoneNumber,
            email,
            password,
            password_confirmation: passwordConfirmation,
    });

      //Si los campos son correctos
      if (response.status === 201) {
        const { access_token, data } = response.data;

        /*Almacenamos los props/variables de estado globales*/
        setUserID(data.id);
        setUserName(data.name);
        setAccessToken(access_token);
        
        navigate('/'); // Redirigir al usuario a HomePage
      } else {
        alert('Error al registrar. Por favor, verifica los campos.');
      }
    } catch (error) {
      console.error('Error al realizar la petición:', error);
      alert('Se ha producido un error. Por favor, intenta nuevamente más tarde.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{color: "#e75b3d"}}>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre:</label>
        <br />
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <label htmlFor="surname">Primer Apellido:</label>
        <br />
        <input
          type="text"
          id="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <br />

        <label htmlFor="surname2">Segundo Apellido:</label>
        <br />
        <input
          type="text"
          id="surname2"
          value={surname2}
          onChange={(e) => setSurname2(e.target.value)}
          required
        />
        <br />

        <label htmlFor="address">Dirección:</label>
        <br />
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <br />

        <label htmlFor="CP">Código Postal:</label>
        <br />
        <input
          type="text"
          id="CP"
          value={CP}
          onChange={(e) => setCP(e.target.value)}
          required
        />
        <br />

        <label htmlFor="phoneNumber">Número de Teléfono:</label>
        <br />
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <br />

        <label htmlFor="email">Email:</label>
        <br />
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label htmlFor="password">Contraseña:</label>
        <br />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <label htmlFor="passwordConfirmation">Confirmar Contraseña:</label>
        <br />
        <input
          type="password"
          id="passwordConfirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit" className="navbar-btn">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;