import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/NavBar.css'
import './styles/buttons.css'
import './styles/ProductsAndCategories.css'

const endpoint = 'http://127.0.0.1:80/api';

const ProductPage = ({ accessToken, userID }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1); // Estado para la cantidad seleccionada
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [cart, setCart] = useState(null); // Estado para el carrito del usuario
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${endpoint}/products/${id}`);
                setProduct(response.data);

                // Obtenemos productos relacionados, con la primera categoría del producto
                const categoryId = response.data.categories[0].id;
                const relatedResponse = await axios.get(`${endpoint}/categories/${categoryId}`);
                const products = relatedResponse.data.products;

                // Filtramos el producto actual de la lista de relacionados
                const filteredProducts = products.filter(p => p.id !== response.data.id);
                setRelatedProducts(filteredProducts);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
                alert('No se pudo cargar la información del producto.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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

                setCart(response.data); // Guardamos el carrito
                console.log(response.data);
            } catch (error) {
                console.error('Error al obtener o crear el carrito:', error);
                alert('No se pudo obtener o crear el carrito.');
            }
        };

        if (userID) {
            fetchCart();
        }
    }, [userID, accessToken]);

    const handleAddToCart = async () => {
        if (!cart) {
            alert('No se ha encontrado el carrito');
            return;
        }
    
        try {
            // Se envía la petición para añadir el producto al carrito
            const response = await axios.put(`${endpoint}/orders/${cart.id}/attachProduct`, 
                {
                    product_id: product.id,  // Asegúrate de que se envíe correctamente el product_id
                    quantity: quantity
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            
            // Si la respuesta es exitosa
            if (response.status === 200) {
                alert('Producto añadido al carrito');
            }
        } catch (error) {
            console.error('Error al añadir producto al carrito:', error);
            alert('No se pudo añadir el producto al carrito.');
        }
    };
    

    if (isLoading) {
        return <div className="main-width">Cargando...</div>;
    }

    return (
        <div className="main-width">
            <h1>{product.name}</h1>
            <img src={product.image} alt={`Imagen de ${product.name}`} className="product-image"/>
            <p>{product.description}</p>
            
            <span className={`product-stock ${product.stock === 0 ? 'Agotado' : ''}`}>
                          {product.stock < 5 ? 'Pocas existencias' : ''}
            </span>


            <div className="product-details">
                      {/* Si hay descuento : Si no hay descuento */}
                      <span className="product-price">
                          {product.discount > 0
                              ? (
                                  <>
                                      <del>{product.price}€</del>{' '}
                                      {(product.price * (1 - product.discount / 100)).toFixed(2)}€
                                  </>
                              ) : (
                                  <>{product.price.toFixed(2)}€</>
                              )}
                      </span>
                      </div>


            {/* Si hemos iniciado sesión podemos añadir productos al carrito */}
            {accessToken && (
                <>
                {/* Selección de cantidad */}
                <div>
                    <label>Cantidad: </label>
                    <select 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        disabled={product.stock === 0}
                    >
                        {/* Si el stock es mayor que 5, el máximo será 5, sino será el stock disponible */}
                        {[...Array(Math.min(5, product.stock)).keys()].map(i => (
                            <option key={i} value={i + 1}>{`${i + 1}`}</option>
                        ))}
                    </select>
                </div>

                {/* Botón para añadir al carrito */}
                <button onClick={handleAddToCart} className="normal-btn">
                    Añadir al carrito
                </button>
                </>
            )}

            <div className="related-products">
                <h3>Productos relacionados</h3>
                <div className="related-products-list">
                    {/* Máximo de 3 productos relacionados */}
                    {relatedProducts.slice(0, 5).map((relatedProduct) => (
                        <div key={relatedProduct.id} className="related-product-card">
                            <Link to={`/product/${relatedProduct.id}`} className="product-card-link">
                                <img src={relatedProduct.image} alt={relatedProduct.name} className="product-image" />
                                <p>{relatedProduct.name}</p>
                                <p>
                                    {relatedProduct.discount > 0 ? (
                                        <>
                                            <del>{relatedProduct.price}€</del>{' '}
                                            {(relatedProduct.price * (1 - relatedProduct.discount / 100)).toFixed(2)}€
                                        </>
                                    ) : (
                                        <>{relatedProduct.price}€</>
                                    )}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default ProductPage;
