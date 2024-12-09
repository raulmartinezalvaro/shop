import React from 'react';
import axios from 'axios';

const endpoint = 'http://127.0.0.1:80/api/orders';

// Elimina un producto de un pedido
const DetachProduct = ({ accessToken, orderID, productID, onDetach }) => {
    const handleDetach = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto del pedido?')) {
            return;
        }

        try {
            await axios.put(`${endpoint}/${orderID}/detachProduct/${productID}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            alert('Producto eliminado del pedido con éxito.');

            // Actualiza el estado del carrito, en Cart.js
            if (onDetach) {
                onDetach(productID);
            }
        } catch (error) {
            console.error('Error al eliminar el producto del pedido:', error);
            alert('Hubo un error al intentar eliminar el producto del pedido. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <button onClick={handleDetach} className="delete-btn">
            Quitar del carrito
        </button>
    );
};

export default DetachProduct;
