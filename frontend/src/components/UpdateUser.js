import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const endpoint = 'http://127.0.0.1:80/api';

const UpdateUser = ({ accessToken, userID }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [surname2, setSurname2] = useState('');
    const [address, setAddress] = useState('');
    const [CP, setCP] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // En caso de no ser dueño del perfil, redirige a la página de inicio
    useEffect(() => {
        if (parseInt(userID) !== parseInt(id)) {
            navigate('/');
        }
    }, [userID, id, navigate]);

    // Cargar datos del usuario
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${endpoint}/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const user = response.data;
                setName(user.name);
                setSurname(user.surname);
                setSurname2(user.surname2);
                setAddress(user.address);
                setCP(user.CP);
                setPhoneNumber(user.phone_number);
                setEmail(user.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [id, accessToken]);

    // Actualizar datos del usuario
    const update = async (e) => {
        e.preventDefault();
        const updatedUser = {
            name,
            surname,
            surname2,
            address,
            CP,
            phone_number: phoneNumber,
            email
        };

        try {
            await axios.put(`${endpoint}/users/${id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert('Datos actualizados con éxito');
            navigate(`/profile`);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('No se pudieron actualizar los datos del usuario.');
        }
    };

    if (isLoading) {
        return <div className="main-width">Cargando datos del usuario...</div>;
    }

    return (
        <>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2 style={{color: "#e75b3d"}}>Modificar perfil</h2>
                <form onSubmit={update} style={{ display: 'inline-block', textAlign: 'left', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Apellido:
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Segundo Apellido:
                            <input
                                type="text"
                                value={surname2}
                                onChange={(e) => setSurname2(e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Dirección:
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Código Postal:
                            <input
                                type="text"
                                value={CP}
                                onChange={(e) => setCP(e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Teléfono:
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </label>
                    </div>
                    <button type="submit" className="navbar-btn" style={{ width: '100%' }}>
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </>
    );
};

export default UpdateUser;
