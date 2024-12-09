import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const endpoint = 'http://127.0.0.1:80/api';

const UpdateProduct = ({ accessToken, userRole }) => {
    const [SKU, setSKU] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState('');
    const [discount, setDiscount] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/'); // Redirige a HomePage si no es administrador
        }
    }, [isAdmin, navigate, id]);

    //Cargamos el producto cada vez que cambia el id
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${endpoint}/products/${id}`);
                const product = response.data;
                setSKU(product.SKU);
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setStock(product.stock);
                setImage(product.image);
                setDiscount(product.discount);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    /* Función para actualizar el producto*/
    const update = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            SKU,
            name,
            description,
            price,
            stock,
            discount
        };

        try {
            await axios.put(`${endpoint}/products/${id}`, updatedProduct, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            navigate(`/admin/categories-products`);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    if (isLoading) {
        return <div className="main-width">Cargando datos del producto...</div>;
    }

    return (
        <>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{color: "#e75b3d"}} >Modificar Producto</h2>
            <form onSubmit={update} style={{ display: 'inline-block', textAlign: 'left', maxWidth: '400px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        SKU:
                        <input type="text" value={SKU} onChange={(e) => setSKU(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Nombre:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Descripción:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Precio:
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Stock:
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Descuento:
                        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <button type="submit" className="navbar-btn" style={{ width: '100%' }}>
                    Guardar Cambios
                </button>
            </form>
        </div>
        </> 
    );
};

export default UpdateProduct;
