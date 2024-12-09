import React from 'react';
import axios from 'axios';

const endpoint = 'http://127.0.0.1:80/api/products';

const DeleteProduct = ({ accessToken, productID, onDelete }) => {
    
    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            return; 
        }

        try {
            await axios.delete(`${endpoint}/${productID}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            alert('Producto eliminado con éxito.');
             // Llamamos a la función en CategoriesAndProducts, para reflejar el cambio
            onDelete(productID);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Hubo un error al intentar eliminar el producto. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <button onClick={handleDelete} className="delete-btn">Eliminar producto</button>
    );
};

export default DeleteProduct;