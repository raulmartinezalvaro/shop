import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import SearchBar from './functions/SearchBar';
import './styles/ProductsAndCategories.css'

import AttachCategory from './functions/AttachCategory';
import DetachCategory from './functions/DetachCategory';
import DeleteProduct from './functions/DeleteProduct';

const endpoint = 'http://127.0.0.1:80/api';

const CategoriesAndProducts = ({ accessToken, userRole }) => {
    const navigate = useNavigate();
    const isAdmin = userRole === 'admin';
    const [categories, setCategories] = useState([]);
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // Lo usaremos para los productos en la barra de búsqueda
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/'); // Redirige a HomePage si no es administrador
        }
    }, [isAdmin, navigate]);

    // Obtenemos las categorías con sus productos
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${endpoint}/categoriesWithProducts`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
                alert('No se pudieron cargar las categorías.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [accessToken]);

    // Obtenemos las productos con sus categorías
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${endpoint}/productsWithCategories`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error al cargar los productos:', error);
                alert('No se pudieron cargar los productos.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [accessToken]);

    // Función al hacer click en una categoría
    const handleCategoryClick = (categoryId) => {
        setExpandedCategoryId((prevId) => (prevId === categoryId ? null : categoryId));
    };

    // Función al hacer click en Borrar categoría
    const handleDeleteCategory = async (categoryId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Este cambio no se puede deshacer');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${endpoint}/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
            );
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            alert('No se pudo eliminar la categoría.');
        }
    };

    // Al quitar un producto de una categoría actualizamos la información en pantalla
    const handleDetach = (categoryID, productID) => {
        setCategories((prevCategories) =>
            prevCategories.map((category) => {
                if (category.id === categoryID) {
                    return {
                        ...category,
                        products: category.products.filter((product) => product.id !== productID),
                    };
                }
                return category;
            })
        );
    
        setProducts((prevProducts) =>
            prevProducts.map((product) => {
                if (product.id === productID) {
                    return {
                        ...product,
                        categories: product.categories.filter((category) => category.id !== categoryID),
                    };
                }
                return product;
            })
        );
    };
    

    // Al añadir un producto a una categoría actualizamos la información en pantalla
    const handleAttach = (categoryID, updatedProduct) => {
        // Actualizamos las categorías y los productos en el estado del frontend
        setCategories((prevCategories) =>
            prevCategories.map((category) => {
                if (category.id === categoryID) {
                    // Añadimos el producto actualizado si no existe ya
                    const productExists = category.products.some(
                        (product) => product.id === updatedProduct.id
                    );
                    return {
                        ...category,
                        products: productExists
                            ? category.products // Si ya está, no lo duplicamos
                            : [...category.products, updatedProduct],
                    };
                }
                return category;
            })
        );
    
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === updatedProduct.id
                    ? updatedProduct // Actualizamos el producto en la lista de productos
                    : product
            )
        );
    };

    // Usamos la barra de búsqueda, usando el nombre de los productos
    const handleSearch = (searchTerm) => {
        const term = searchTerm.toLowerCase();
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
    };

    // Al eliminar un productos actualizamos la información en pantalla
    const handleDeleteProduct = (productID) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productID));
    
    };

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);    


    // Mostrar un mensaje de carga, hasta que se hayan encontrado las categorías
    if (isLoading) {
        return <div className="main-width"> Cargando... </div>;
    }

    return (
        <div className="main-width">
        {/* Sección de Categorías */}
        <h2>Categorías</h2>
        <Link to="/admin/store/category" className="navbar-btn">Crear nueva categoría</Link>
        <ul>
            {categories.map((category) => (
                <div key={category.id} className="category-container">
                    <div className="category-header"
                        onClick={() => handleCategoryClick(category.id)}
                    >
                <strong className="category-name">{category.name}</strong>
                <Link
                    to={`/update/category/${category.id}`}
                    className="normal-btn2"
                    onClick={(e) => e.stopPropagation()} // Evitamos que el clic en el link active el botón
                >
                    Modificar categoría
                </Link>
                <button className="delete-btn" onClick={(e) => {
                        e.stopPropagation(); // Igual que para modificar, evitamos que el clic en el link active el botón
                        handleDeleteCategory(category.id);
                    }}
                >
                    Eliminar categoría
                </button>
                </div>
                    {expandedCategoryId === category.id && (
                        <div className="product-list">
                            {category.products.length === 0 ? (
                                <p>No hay productos en esta categoría.</p>
                            ) : (
                                <ul>
                                    {category.products.map((product) => (
                                        <tr key={product.id}>
                                            <td><Link to={`/product/${product.id}`} className="product-link"> {product.name}</Link></td>
                                            <td><Link to={`/update/product/${product.id}`} className="normal-btn">Modificar producto</Link></td>
                                            <td><DetachCategory
                                                accessToken={accessToken}
                                                productID={product.id}
                                                categoryID={category.id}
                                                onDetach={handleDetach}
                                            /></td>
                                        </tr>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </ul>

        {/* Sección de productos */}
        <h2>Productos</h2>
        <Link to="/admin/store/product" className="navbar-btn">Añadir producto</Link>
        <SearchBar
            className="search-bar"
            placeholder="Buscar productos por nombre..."
            onSearch={handleSearch}
        />
        <table className="product-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Categorías</th>
                    <th>Añadir categorías</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.map((product) => (
                    <tr key={product.id}>
                        <td>
                            <Link to={`/product/${product.id}`} className="product-link">
                                {product.name}
                            </Link>
                        </td>
                        <td>
                            {product.categories.length > 0 ? (
                                product.categories.map((category) => (
                                    <span key={category.id} className="category-badge">
                                        {category.name}
                                    </span>
                                ))
                            ) : (
                                <span className="no-category">Sin categoría</span>
                            )}
                        </td>
                        <td>
                            <AttachCategory
                                accessToken={accessToken}
                                productID={product.id}
                                categories={categories}
                                onAttach={handleAttach}
                            />
                        </td>
                        <td>
                            <Link to={`/update/product/${product.id}`} className="normal-btn2">
                                Modificar producto
                            </Link>
                            <DeleteProduct
                                accessToken={accessToken}
                                productID={product.id}
                                onDelete={handleDeleteProduct}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        </div>
    );
};

export default CategoriesAndProducts;
