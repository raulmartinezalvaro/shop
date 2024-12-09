import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Orders.css';

const endpoint = 'http://127.0.0.1:80/api';

const Orders = ({ accessToken, userID, userRole }) => {
    const [orders, setOrders] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const { id } = useParams();
    const isAdmin = userRole === 'admin';
    const navigate = useNavigate();

    // En caso de no ser dueño del perfil o admin, redirige a la página de inicio
    useEffect(() => {
        if (!isAdmin && parseInt(userID) !== parseInt(id)) {
            navigate('/');
        }
    }, [userID, id, isAdmin, navigate]);

    // Carga los pedidos del usuario, los ordenamos por orden de creación y excluimos la cesta
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userIdToFetch = isAdmin ? id : userID; // Si es admin, usar ID de la URL
                const response = await axios.post(
                    `${endpoint}/userOrders`,
                    { user_id: userIdToFetch },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                // Filtramos y ordenamos los pedidos
                const filteredOrders = response.data
                    .filter((order) => order.status !== 'carrito') // Excluimos la cesta
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Ordenamos por orden de creación (más recientes primero)

                setOrders(filteredOrders);
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
        };

        fetchOrders();
    }, [accessToken, userID, id, isAdmin]);

    const handleUpdateOrderStatus = async (orderId) => {
        try {
             // Si no somos admin se envía el status "cancelado"
            const statusToUpdate = isAdmin ? selectedStatus : 'cancelado';
            const response = await axios.put(`${endpoint}/orders/${orderId}`,
                {
                    status: statusToUpdate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            if (response.status === 200) {
                // Mostramos el cambio, en el momento
                setOrders(orders.map(order => 
                    order.id === orderId ? { ...order, status: statusToUpdate } : order
                ));
            }
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
            alert('No se pudo actualizar el estado del pedido.');
        }
    };

    return (
        <div className="main-width">
            <h2 style={{ color: '#e75b3d', textAlign: 'center' }}>Mis Pedidos</h2>
            {orders === null ? (
                <p style={{ textAlign: 'center' }}>Cargando pedidos...</p>
            ) : orders.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Aún no tienes pedidos.</p>
            ) : (
                <div className="button-grid">
                    {orders.map((order) => (
                        <div key={order.id} className="button-card">
                            <h3 style={{ color: '#e75b3d' }}>Pedido #{order.id}</h3>
                            <p><strong>Estado:</strong> {order.status}</p>
                            <p><strong>Precio Total:</strong> {order.total_price}€</p>
                            <p><strong>Dirección de Envío:</strong> {order.shipping_address}</p>
                            <p>
                                <strong>Fecha de Creación:</strong>{' '}
                                {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <div>
                                <strong>Productos:</strong>
                                {order.products.length === 0 ? (
                                    <p>Este pedido no tiene productos asociados.</p>
                                ) : (
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
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
                                                        <p style={{ margin: 0 }}><strong>{product.name}</strong></p>
                                                        <p style={{ margin: 0 }}>Cantidad: {product.quantity}</p>
                                                        <p style={{ margin: 0 }}>Precio: {product.price}€</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {isAdmin ? (
                                <div>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="">Selecciona un estado</option>
                                        <option value="pendiente de gestión">Pendiente de gestión</option>
                                        <option value="pendiente de envío">Pendiente de envío</option>
                                        <option value="enviado">Enviado</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                    <button
                                        onClick={() => handleUpdateOrderStatus(order.id)}
                                        className="normal-btn"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Actualizar Estado
                                    </button>
                                </div>
                            ) : (
                                order.status === 'pendiente de gestión' && (
                                    <button
                                        onClick={() => handleUpdateOrderStatus(order.id)}
                                        className="delete-btn"
                                    >
                                        Cancelar Pedido
                                    </button>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;