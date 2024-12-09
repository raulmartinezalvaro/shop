import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ placeholder, onSearch, className }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className={`${className} search-bar`}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder={placeholder || 'Buscar...'}
                className="search-input"
            />
        </div>
    );
};

export default SearchBar;
