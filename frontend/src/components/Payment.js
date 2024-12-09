import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './styles/ProductsAndCategories.css';
import './styles/buttons.css';

const endpoint = 'http://127.0.0.1:80/api';

const Payment = ({ accessToken, userID }) => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [cartId, setCartId] = useState(null); // Lo usamos exclusivamente para almacenar el id del carrito
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!accessToken) {
            navigate('/'); // Redirige a HomePage si no está logeado el usuario
        }
    }, [accessToken, navigate]);

    // Buscamos el carrito del usuario
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

                // Obtenemos el carrito con los productos
                const cartDetailsResponse = await axios.get(`${endpoint}/cart/${createdCart.id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setCart(cartDetailsResponse.data);

            } catch (error) {
                console.error('Error al obtener el carrito:', error);
                alert('No se pudo cargar el carrito.');
            }
        };

        if (userID) {
            fetchCart();
        }
    }, [userID, accessToken]);

    // Función para actualizar el estado del pedido
    const handleUpdateOrderStatus = async () => {
        if (cart && cart.status === 'carrito') {
            try {
                await axios.put(
                    `${endpoint}/orders/${cart.id}`,
                    {
                        status: 'pendiente de gestión',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setShowModal(true);

            } catch (error) {
                console.error('Error al actualizar el estado del pedido:', error);
                alert('No se pudo actualizar el estado del pedido.');
            }
        } else {
            alert('El estado del pedido no es "carrito".');
        }
    };

    // Mostrar un mensaje de carga si aún no hay datos
    if (!cart) {
        return <div className="main-width">Cargando...</div>;
    }

    return (
        <div className="main-width">
            <p><strong>Para completar el pago, por favor realice el siguiente proceso:</strong></p>
            <ul>
                <li>Bizum: xxx xxx xxx</li>
                <li>Transferencia bancaria a: xxxxxxxxxx</li>
            </ul>
            <p>Recuerde indicar en el asunto del pago el ID de su pedido: <strong>{cart.id}</strong></p>
            <p><strong>Total del carrito: </strong>{cart.total_price.toFixed(2)}€</p>
            <p>*Al hacer clic en "Aceptar", su pedido pasará a trámite. Recibirá una notificación cuando se verifique el pago.*</p>

            {/* Botón para actualizar el estado del pedido */}
            <button onClick={handleUpdateOrderStatus} className="normal-btn2">
                Aceptar
            </button>

            <Link to="/cart" className="normal-btn">
                Volver al carrito
            </Link>

            {/* Modal */}
            {showModal && (
                <div>
                    <div>
                        <h3>¡Su pedido ha entrado en trámite!</h3>
                        <p>Su pedido ha sido registrado con éxito y está en proceso de verificación.</p>
                        <p>Puede revisar el estado de su pedido en <Link to={`/orders/${userID}`} className="normal-btn">Mis pedidos</Link>.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment;
