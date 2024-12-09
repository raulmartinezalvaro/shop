import axios from 'axios';
import React, { useState } from 'react';

const endpoint = 'http://127.0.0.1:80/api';

// Añade un producto a una categoría
const AttachCategory = ({ accessToken, productID, categories, onAttach }) => {
    const [selectedCategoryID, setSelectedCategoryID] = useState('');

    const handleAttach = async () => {
        if (!selectedCategoryID) {
            alert('Por favor, selecciona una categoría.');
            return;
        }

        try {
            const response = await axios.put(`${endpoint}/products/attachCategories`, {
                product_id: productID,
                category_ids: [selectedCategoryID],
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Actualiza la información en pantalla
            if (onAttach) {
                const updatedProduct = response.data.product;
                const updatedCategoryID = parseInt(selectedCategoryID, 10)
                onAttach(updatedCategoryID, updatedProduct);
            }

        } catch (error) {
            console.error('Error al añadir el producto a la categoría:', error);
            alert('Hubo un error al intentar añadir el producto a la categoría. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div>
            {/* Selección de categoría */}
            <select
                id="category-select"
                value={selectedCategoryID}
                onChange={(e) => setSelectedCategoryID(e.target.value)}
            >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            <button onClick={handleAttach} className="normal-btn">
                Añadir a categoría
            </button>
        </div>
    );
};

export default AttachCategory;
