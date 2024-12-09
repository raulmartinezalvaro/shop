import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './styles/NavBar.css'

const endpoint = 'http://127.0.0.1:80/api';

const StoreProduct = ({ accessToken, userRole }) => {
    const [SKU, setSKU] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const [discount, setDiscount] = useState('');
    const navigate = useNavigate();
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/'); // Redirige a HomePage si no es administrador
        }
    }, [isAdmin, navigate]);

    const store = async (e) => {
        e.preventDefault();
        /* Validación del descuento
            Si el valor no es válido se la asigna 0 */
        const parsedDiscount = parseFloat(discount) || 0;
        if (parsedDiscount < 0 || parsedDiscount > 100) {
            alert("El descuento debe estar entre 0 y 100.");
            return;
        }

        /* Comprobamos que la imagen es .png o .jpg*/
        const validTypes = ['image/png', 'image/jpeg'];
        if (!validTypes.includes(image.type)) {
            alert('La imagen debe ser un archivo .png o .jpg.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('SKU', SKU);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', parseFloat(price));
            formData.append('stock', parseInt(stock));
            formData.append('discount', parsedDiscount);
            formData.append('image', image);

            await axios.post(`${endpoint}/products`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

        navigate(`/admin/categories-products`);

        } catch (error) {
            console.error('Error storing product:', error);
        }
    };

    return (
    <>
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2 style={{color: "#e75b3d"}}>Añadir producto</h2>
    <form onSubmit={store} style={{ display: 'inline-block', textAlign: 'left', maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
            <label>SKU:</label>
            <input
                type="text"
                value={SKU}
                onChange={(e) => setSKU(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
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
        <div style={{ marginBottom: '10px' }}>
            <label>Precio (€):</label>
            <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label>Stock:</label>
            <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label>Imagen:</label>
            <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setImage(e.target.files[0])}
                required
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        <div style={{ marginBottom: '10px' }}>
            <label>Descuento (%):</label>
            <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        <button type="submit" className="navbar-btn" style={{ width: '100%' }}>
            Añadir producto
        </button>
    </form>
    </div>

    </>
    )
}

export default StoreProduct