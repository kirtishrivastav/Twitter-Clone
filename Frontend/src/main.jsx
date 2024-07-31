import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Home from './Components/Home/Home';
import Feed from './Components/Feed/Feed';
import Profile from './Components/Profile/Profile';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import OtherUserProfile from './Components/OtherUser/OtherUserProfile';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from './Context/userContext';


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Feed />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/user/:userId",
        element: <OtherUserProfile></OtherUserProfile>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <UserProvider>
    <RouterProvider router={appRouter} />
    
    </UserProvider>
   
  </React.StrictMode>
);
