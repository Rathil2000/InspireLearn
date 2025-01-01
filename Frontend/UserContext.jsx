// src/UserContext.js
import  { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const UserContext = createContext();

export const UserProvider = ({ children}) => {
  const [user, setUser] = useState(null); // Start with null, will be updated with logged-in data
  const [loading, setLoading] = useState(true); // To manage loading state while fetching data

  useEffect(() => {
    // Simulate fetching logged-in admin's data (You can replace this with actual API call)
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('adminEmail');
    
        if (token && email) {
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/admin`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(null); // Reset the user state before updating
          setUser(response.data); // Update the user data
        } else {
          setUser({
            name: 'Guest User',
            profession: 'Not logged in',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({
          name: 'Error',
          profession: 'Error fetching user data',
        });
      } finally {
        setLoading(false);
      }
    };
    

    fetchUserData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching user data
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

