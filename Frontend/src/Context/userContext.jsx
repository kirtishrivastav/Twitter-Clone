/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { USER_ENDPOINT } from '../Utils/constants';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading as true

  const updateUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${USER_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setLoading(false); // Set loading to false after data is fetched
      console.log('User data updated:', response.data);
    } catch (error) {
      console.error('Error fetching user data', error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const userId = localStorage.getItem('userId');
      if (userId) {
        await updateUser(userId);
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, loading ,setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
