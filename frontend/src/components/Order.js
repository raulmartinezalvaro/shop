import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Orders.css';

const endpoint = 'http://127.0.0.1:80/api';

const Order = ({ accessToken, userID }) => {
    const { id } = useParams();  // Obtenemos el ID del pedido desde la URL
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();  // Para redirigir al usuario

    useEffect(() => {
        console.log("UserID recibido:", userID);
        const fetchOrder = async () => {
          try {
            const storedUserID = localStorage.getItem('userID');  // Obtener el ID del usuario desde localStorage
      
            const response = await axios.get(`${endpoint}/orders/${id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            
        console.log("storedUserID recibido:", storedUserID);
      
            if (userID !== storedUserID) {
              navigate('/');  // Si el usuario no es dueño del pedido, redirigir al inicio
            } else {
              setOrder(response.data);
            }
          } catch (error) {
            console.error('Error al obtener el pedido:', error);
            alert('No se pudo cargar el pedido.');
          }
        };
      
        fetchOrder();
      }, [id, accessToken, navigate, userID]);  // Dependemos también de userID
      

    if (!order) return <div>Cargando...</div>;

    return (
        <div className="order-detail-container">
            <h2>Detalles del Pedido #{order.id}</h2>
            <p><strong>Estado:</strong> {order.status}</p>
            <p><strong>Precio Total:</strong> {order.total_price}€</p>
            <p><strong>Dirección de Envío:</strong> {order.shipping_address}</p>
            <p><strong>Fecha de Creación:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            
            <div>
                <h3>Productos:</h3>
                <ul>
                    {order.products.map((product) => (
                        <li key={product.id} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '5px',
                                        marginRight: '10px',
                                    }}
                                />
                                <div>
                                    <p style={{ margin: 0 }}>
                                        <strong>{product.name}</strong>
                                    </p>
                                    <p style={{ margin: 0 }}>Cantidad: {product.quantity}</p>
                                    <p style={{ margin: 0 }}>Precio: {product.price}€</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Order;
