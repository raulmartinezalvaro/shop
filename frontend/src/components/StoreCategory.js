import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './styles/NavBar.css'

const endpoint = 'http://127.0.0.1:80/api';

const StoreCategory = ({ accessToken, userRole }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/'); // Redirige a HomePage si no es administrador
        }
    }, [isAdmin, navigate]);

    const store = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${endpoint}/categories`, {
                name: name,
                description: description
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

        // Volvemos a la página de categorías
        navigate(`/admin/categories-products`);

        } catch (error) {
            console.error('Error storing category:', error);
        }
    };

    return (
    <>
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2 style={{color: "#e75b3d"}}>Crear categoría</h2>
    <form onSubmit={store} style={{ display: 'inline-block', textAlign: 'left', maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
            <label>Nombre:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label>Descripción:</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        <button type="submit" className="navbar-btn" style={{ width: '100%' }}>
            Añadir categoría
        </button>
    </form>
    </div>
    </>
    )
}

export default StoreCategory;