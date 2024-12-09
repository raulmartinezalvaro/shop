import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import Select from 'react-select';
import SearchBar from './functions/SearchBar';
import './styles/ProductsAndCategories.css'
import './styles/NavBar.css'
import './styles/SearchBar.css'

const endpoint = 'http://127.0.0.1:80/api';

const HomePage = ({ } ) => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para la barra de búsqueda de productos
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchCategories, setSearchCategories] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /* useEffect se ejecuta nada más cargar la página, en este caso
  para buscar los productos con sus categorías*/
  useEffect(() => {
    fetchProductsAndCategories();
  }, []);
  
  const fetchProductsAndCategories = async () => {
    try {
      const productsResponse = await axios.get(`${endpoint}/productsWithCategories`);
      setProducts(productsResponse.data);
      setFilteredProducts(productsResponse.data); // Inicialmente mostramos todos los productos

      const categoriesResponse = await axios.get(`${endpoint}/categories`);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error al cargar productos o categorías:', error);
      alert('Hubo un problema al cargar los productos o las categorías. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, searchCategories]);

  // Manejo al seleccionar categorías
  const applyFilters = () => {
    const term = searchCategories.toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(term);

      if (selectedCategories.length > 0) {
        const selectedCategoryIds = selectedCategories.map((cat) => cat.value);
        const belongsToCategory = product.categories.some((cat) =>
          selectedCategoryIds.includes(cat.id)
        );
        return matchesSearch && belongsToCategory;
      }

      return matchesSearch; // Si no hay categorías seleccionadas
    });

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []); // Si no hay selección, se limpia
  };

  // Maneja la barra de búsqueda
  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();

    // Filtrar por nombre y categorías seleccionadas
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(term);

      if (selectedCategories.length > 0) {
        const selectedCategoryIds = selectedCategories.map((cat) => cat.value);
        const belongsToCategory = product.categories.some((cat) =>
          selectedCategoryIds.includes(cat.id)
        );
        return matchesSearch && belongsToCategory;
      }

      return matchesSearch; // Si no hay categorías seleccionadas
    });

    setFilteredProducts(filtered);
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <>
    {isLoading ? (
        <div className="main-width">
          <p>Cargando...</p>
        </div>
      ) : (
    <>
      <br/>
      <div className="main-width">
        <div className="search-categories-products-grid">
            <Select
                options={categoryOptions}
                onChange={handleCategoryChange}
                isMulti
                isClearable
                placeholder="Categorías"
                className="category-dropdown"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: state.isFocused ? '#ccc' : '#ccc',
                    boxShadow: state.isFocused ? '0 0 0 1px #d94a32' : '',
                    '&:hover': {
                      borderColor: '#d94a32',
                    },
                  }),
              }}
            />
            <SearchBar
                className="search-bar-home-page"
                placeholder="Buscar productos por nombre..."
                onSearch={handleSearch}
            />
        </div>

        {/* Hasta que no se carguen los productos no renderizamos el resto */}
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
              <p>{products.length > 0 ? 'No se encontraron productos.' : 'Cargando productos...'}</p>
          ) : (
            filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-card-link">
                  <header>
                    <img src={product.image} alt={`Imagen de ${product.name}`} className="product-image" />
                    <h3>{product.name}</h3>
                  </header>
                  {/* <p>{product.description}</p> */}


                  {/* Categorías */}
                  <div className="product-categories">
                    {product.categories.length > 0 ? (
                      product.categories.map((category) => (
                        <span key={category.id} className="category-badge">
                          {category.name}
                        </span>
                      ))
                    ) : (
                      <span className="no-category">Sin categoría</span>
                    )}
                  </div>


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
                      <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : product.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                          {product.stock === 0 ? 'Agotado' : product.stock < 5 ? 'Pocas existencias' : 'En stock'}
                      </span>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </>
    )}
    </>
  );
}

export default HomePage;
