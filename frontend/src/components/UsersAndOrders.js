import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './functions/SearchBar';
import './styles/buttons.css';
import './styles/UsersAndOrders.css';
import './styles/ProductsAndCategories.css'

const endpoint = 'http://127.0.0.1:80/api';

const UsersAndOrders = ({ accessToken, userRole }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const navigate = useNavigate();
    const isAdmin = userRole === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            navigate('/'); // Redirige a HomePage si no es administrador
        }
    }, [isAdmin, navigate]);

    // Recuperamos el listado de usuarios, con sus pedidos
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${endpoint}/users`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                // Ordenar usuarios al cargar por primera vez
                const sortedUsers = response.data.sort((a, b) => {
                    const hasPendingA = a.orders.some((order) =>
                        ['pendiente de gestión', 'pendiente de envío', 'enviado'].includes(order.status)
                    );
                    const hasPendingB = b.orders.some((order) =>
                        ['pendiente de gestión', 'pendiente de envío', 'enviado'].includes(order.status)
                    );

                    // Los usuarios con pedidos pendientes van primero
                    return hasPendingB - hasPendingA;
                });

                setUsers(sortedUsers);
                setFilteredUsers(sortedUsers);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                alert('No se pudo cargar la lista de usuarios.');
            }
        };

        fetchUsers();
    }, [accessToken]);

    const handleSearch = () => {
        const filtered = users.filter((user) => {
            const fullName = `${user.name} ${user.surname} ${user.surname2}`.toLowerCase();
            return (
                fullName.includes(searchName.toLowerCase()) &&
                user.email.toLowerCase().includes(searchEmail.toLowerCase())
            );
        });

        // Ordenar los usuarios filtrados: primero con pedidos pendientes
        const sortedFiltered = filtered.sort((a, b) => {
            const hasPendingA = a.orders.some((order) =>
                ['pendiente de gestión', 'pendiente de envío', 'enviado'].includes(order.status)
            );
            const hasPendingB = b.orders.some((order) =>
                ['pendiente de gestión', 'pendiente de envío', 'enviado'].includes(order.status)
            );

            // Los usuarios con pedidos pendientes van primero
            return hasPendingB - hasPendingA;
        });

        setFilteredUsers(sortedFiltered);
    };

    // Cuando cambia searchName o searchEmail se llama a handleSearch, para refrescar la tabla
    useEffect(() => {
        handleSearch();
    }, [searchName, searchEmail]);

    // Función para manejar el cambio de rol de admin a user o viceversa
    const handleChangeRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        
        try {
            const response = await axios.put(
                `${endpoint}/users/${userId}`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            if (response.status === 200) {
                // Refrescamos la información, en pantalla
                setFilteredUsers((prevFilteredUsers) =>
                    prevFilteredUsers.map((user) =>
                        user.id === userId ? { ...user, role: newRole } : user
                    )
                );
            }
        } catch (error) {
            console.error('Error al cambiar el rol del usuario:', error);
            alert('No se pudo cambiar el rol del usuario.');
        }
    };

    return (
        <div className="main-width">
            <div className="filter-bar">
                <SearchBar
                    className="name-search-bar"
                    placeholder="Buscar por nombre..."
                    onSearch={(value) => setSearchName(value)}
                />
                <SearchBar
                    className="email-search-bar"
                    placeholder="Buscar por email..."
                    onSearch={(value) => setSearchEmail(value)}
                />
            </div>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Nombre completo</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                        <th>Pedidos pendientes</th>
                        <th>Comprobar pedidos</th>
                    </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => {
                    // Realizamos un filtrado por cada usuario, para pedidos con un estado concreto
                    const pendingOrders = user.orders.filter((order) =>
                        ['pendiente de gestión', 'pendiente de envío', 'enviado'].includes(order.status)
                    );

                    return (
                        <tr key={user.id}>
                            <td>{`${user.name} ${user.surname} ${user.surname2}`}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button 
                                    onClick={() => handleChangeRole(user.id, user.role)} 
                                    className="normal-btn2">
                                    Modificar rol
                                </button>
                            </td>
                            <td>
                                {pendingOrders.length > 0 ? (
                                    pendingOrders.map((order) => (
                                        <span key={order.id} className={`order-badge`}>
                                            {order.status}
                                        </span>
                                    ))
                                ) : (
                                    <span className="no-pending-orders">
                                        Este usuario no tiene pedidos pendientes
                                    </span>
                                )}
                            </td>
                            <td>
                                <Link to={`/orders/${user.id}`} className="button-card-link">
                                    <h3 style={{ color: '#e75b3d' }}>Ver pedidos</h3>
                                </Link>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default UsersAndOrders;
