import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const endpoint = 'http://127.0.0.1:80/api';

const UpdateCategory = ({ accessToken, userRole }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/'); // Redirige a HomePage si no es administrador
        }
    }, [isAdmin, navigate, id]);

    //Cargamos la categoría cada vez que cambia el id
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${endpoint}/categories/${id}`);
                const category = response.data;
                setName(category.name);
                setDescription(category.description);
            } catch (error) {
                console.error('Error fetching category:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    /* Función para  actualizar la categoría*/
    const update = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${endpoint}/categories/${id}`, {
                name: name,
                description: description,
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            navigate(`/admin/categories-products`);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    if (isLoading) {
        return <div className="main-width">Cargando datos de la categoría...</div>;
    }

    return (
        <>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{color: "#e75b3d"}} >Modificar Categoría</h2>
            <form onSubmit={update} style={{ display: 'inline-block', textAlign: 'left', maxWidth: '400px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Nombre:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Descripción:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} 
                        style={{ width: '100%', padding: '8px' }}/>
                    </label>
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
        </> 
    );
};

export default UpdateCategory;
