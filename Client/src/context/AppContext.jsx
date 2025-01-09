import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create a Context for the App
export const AppContext = createContext();

// Context Provider Component
export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true

  const backend_URL = import.meta.env.VITE_BACKEND_URL;

  const [theme, setTheme] = useState('light')
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userDataVer, setUserDataVer] = useState(null);
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backend_URL + '/api/auth/is-auth');
      
      if (data?.success) {
        setIsLoggedin(true);
        getUserData();
      } else {
        // Handle case where user is not authenticated or no data is returned
        setIsLoggedin(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong! Please try again later.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      });
    }
  };
  
  // Fetch user data after login or registration and display the name 
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backend_URL + '/api/user/data');

      if (data.success) {
        setUserDataVer(data.userData.IsVerified)
        setUserData(data.userData.Name); 
        
        console.log('User Data:', data.userData);
      } else {
        toast.error(data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: true,
          theme: 'colored',
          className: 'toast-error',
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong! Please try again later.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      });
    }
  };

  useEffect(()=>{
    getAuthState()
  },[])

  const value = {
    backend_URL,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    userDataVer,
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};