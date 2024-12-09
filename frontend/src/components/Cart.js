import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import DetachProduct from './DetachProduct';
import './styles/ProductsAndCategories.css'
import './styles/buttons.css'

const endpoint = 'http://127.0.0.1:80/api';

const Cart = ({ accessToken, userID }) => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [cartId, setCartId] = useState(null); // Lo usamos exclusivamente para almacenar el id del carrito

    useEffect(() => {
        if (!accessToken) {
            navigate('/'); // Redirige a HomePage si no está logeado el usuario
        }
    }, [accessToken, navigate]);

    // Buscamos el carrito del usuario, y sino existe lo creamos
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.post(
                    `${endpoint}/orders/getOrCreateCart`,
                    { user_id: userID },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const createdCart = response.data;
                setCartId(createdCart.id); // Guardamos el ID del carrito

                // Obtenemos el carrito, con sus productos
                const cartDetailsResponse = await axios.get(`${endpoint}/cart/${createdCart.id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setCart(cartDetailsResponse.data);
            } catch (error) {
                console.error('Error al obtener o crear el carrito:', error);
                alert('No se pudo cargar el carrito.');
            }
        };

        if (userID) {
            fetchCart();
        }
    }, [userID, accessToken]);

    // Actualizamos el carrito, al quitar un producto
    const handleDetach = (productID) => {
        setCart((prevCart) => {
            const productToRemove = prevCart.products.find((product) => product.id === productID);
    
            // Recalculamos el nuevo total
            const newTotalPrice =
                prevCart.total_price - productToRemove.pivot.price * productToRemove.pivot.quantity;
    
            return {
                ...prevCart,
                products: prevCart.products.filter((product) => product.id !== productID),
                total_price: newTotalPrice,
            };
        });
    };

    // Mostrar un mensaje de carga si aún no hay datos
    if (!cart) {
        return <div className="main-width">Cargando...</div>;
    }

    return (
        <div className="main-width">
            <h2>Mi carrito</h2>
            {cart.products && cart.products.length > 0 ? (
                <div className="product-grid">
                    {cart.products.map(product => (
                        <div key={product.id} className="product-card">
                        <Link to={`/product/${product.id}`} className="product-card-link">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                            />
                            <h3>{product.name}</h3>
                            <p>Cantidad: {product.pivot.quantity}</p>
                            <p>Precio por unidad: {product.pivot.price}€</p>
                            <p>Total: {(product.pivot.quantity * product.pivot.price).toFixed(2)}€</p>
                        </Link>
                        <DetachProduct
                            accessToken={accessToken}
                            orderID={cart.id}
                            productID={product.id}
                            onDetach={handleDetach}
                        />
                    </div>
                    ))}
                </div>
            ) : (
                <p>La cesta está vacía.</p>
            )}
            {cart.products && cart.products.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <p>Total del carrito: {cart.total_price.toFixed(2)}€</p>
                <Link to={`/payment/${cart.id}`} className="payment-btn">
                    Proceder a pago
                </Link>
            </div>
        )}
        </div>
    );
};

export default Cart;
