import React from 'react';
import axios from 'axios';

const endpoint = 'http://127.0.0.1:80/api';

// Quita un producto de una categoría
const DetachCategory = ({ accessToken, categoryID, productID, onDetach }) => {
    const handleDetach = async () => {
        if (!window.confirm('¿Estás seguro de que deseas quitar este producto de esta categoría?')) {
            return;
        }

        try {
            await axios.put(`${endpoint}/products/detachCategories`,
                {
                    product_id: productID,
                    category_ids: [categoryID],
                },
                {headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Actualiza el estado de la categoría, en Categories.js
            if (onDetach) {
                onDetach(categoryID, productID);
            }
        } catch (error) {
            console.error('Error al quitar el producto de la categoría:', error);
            alert('Hubo un error al intentar quitar el producto de la categoría. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <button onClick={handleDetach} className="delete-btn">
            Eliminar de la categoría
        </button>
    );
};

export default DetachCategory;
