import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin';
import StoreProduct from './components/StoreProduct';
import StoreCategory from './components/StoreCategory';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import ProductPage from './components/ProductPage';
import UpdateProduct from './components/UpdateProduct';
import UpdateCategory from './components/UpdateCategory';
import Profile from './components/Profile';
import UpdateUser from './components/UpdateUser';
import Orders from './components/Orders';
import Order from './components/Order';
import Cart from './components/Cart';
import Payment from './components/Payment';
import CategoriesAndProducts from './components/CategoriesAndProducts';
import UsersAndOrders from './components/UsersAndOrders';
import NavBar from './components/NavBar';

function App() {
    /*Props, a diferencia de localStorage, estos no se mantienen
  cuando se recarga la página*/
  const [accessToken, setAccessToken] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  /*Los items que almacenamos, en Login.js, los configuramos
  aquí para que al refrescar la web no perdamos la sesión*/
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const id = localStorage.getItem('userID');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('userRole');

    if (token) {
      setAccessToken(token);
      setUserID(id);
      setUserName(name);
      setUserRole(role);
    }
  }, []);

  return (
    <BrowserRouter>
      <NavBar
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          userID={userID}
          setUserID={setUserID}
          setUserName={setUserName}
          userRole={userRole}
          setUserRole={setUserRole}
      />
      <Routes>
        <Route path='/admin' element={ <Admin 
          userRole={userRole}/> } />

        <Route path='/admin/store/product' element={ <StoreProduct 
          accessToken={accessToken} 
          userRole={userRole}/> } />

        <Route path='/admin/store/category' element={ <StoreCategory 
          accessToken={accessToken}
          userRole={userRole}/> } />

        <Route path='/admin/categories-products' element={ <CategoriesAndProducts 
          accessToken={accessToken}
          userRole={userRole}/> } />
          
        <Route path='/admin/users-orders' element={ <UsersAndOrders 
          accessToken={accessToken}
          userRole={userRole}/> } />

        <Route path='/' element={ <HomePage/> } />
          
        <Route path="/login" element={ <Login
          setAccessToken={setAccessToken}
          setUserID={setUserID}
          setUserName={setUserName}
          setUserRole={setUserRole} /> } />

        <Route path="/register" element={ <Register
          setAccessToken={setAccessToken}
          setUserID={setUserID}
          setUserName={setUserName}/> } />
        
        <Route path="/product/:id" element={ <ProductPage 
          accessToken={accessToken}
          userID={userID}/> } />

        <Route path='/update/product/:id' element={ <UpdateProduct 
          accessToken={accessToken}
          userRole={userRole}/> } />
          
        <Route path='/update/category/:id' element={ <UpdateCategory
          accessToken={accessToken}
          userRole={userRole}/> } />

        <Route path='/profile' element={ <Profile 
          accessToken={accessToken}
          userID={userID}/> } />

        <Route path='/update-profile/:id' element={ <UpdateUser 
          accessToken={accessToken}
          userID={userID}/> } />

        <Route path='/orders/:id' element={ <Orders 
          accessToken={accessToken}
          userID={userID}
          userRole={userRole}/> } />

        <Route path='/order/:id' element={ <Order
          accessToken={accessToken}
          userID={userID}/> } />

        <Route path='/cart' element={ <Cart 
          accessToken={accessToken}
          userID={userID}/> } />

        <Route path='/payment/:id' element={ <Payment 
          accessToken={accessToken}
          userID={userID}/> } />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
