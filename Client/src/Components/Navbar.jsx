import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, userDataVer, setUserData, setIsLoggedin, backend_URL } = useContext(AppContext);


  const sendVerificationOtp = async ()=>{
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backend_URL + '/api/auth/send-verify-otp')

      if(data.success){
        navigate('/email-verify')
        toast.success('OTP Send To Your Gmail', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          theme: 'colored',
          className: 'toast-success',
        })
      }else{
        toast.error(data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: true,
          theme: 'colored',
          className: 'toast-error',
        })
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'Something went wrong! Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      })
    }
  }

  const logout = async ()=>{
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backend_URL + '/api/auth/logout')

     if (data.success) {
             setIsLoggedin(false)
             setUserData(false)
             navigate('/')
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
              error.response?.data?.message || 'Something went wrong!';
            toast.error(errorMessage, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeButton: true,
              theme: 'colored',
              className: 'toast-error',
            });
    }
  } 

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const dropdownRef = useRef(null);
  const profileRef = useRef(null);


  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Handle click outside to close the dropdown
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      profileRef.current && !profileRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // Set up the event listener for clicks outside
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 z-50 flex items-center justify-between w-full p-2 bg-white rounded-b-lg shadow-md sm:p-4">

      <div className="flex items-center space-x-2">
        <img
          src={assets.picture}
          alt="Logo"
          className="w-8 p-1 transition-all duration-300 transform border-2 border-gray-300 rounded-full sm:w-12 hover:scale-110 hover:rotate-6 hover:shadow-md"
        />
        <p className="text-sm font-semibold tracking-tight text-gray-800 sm:text-lg">Auth</p>
      </div>

      {userData ? (
        <div
          className="relative flex items-center justify-center w-12 h-12 text-lg font-semibold text-white transition-all duration-300 ease-in-out bg-blue-600 rounded-full shadow-lg cursor-pointer group hover:scale-105"
          onClick={handleDropdownToggle}
          ref={profileRef} // Reference for the profile icon
        >
          {userData[0].toUpperCase()}


          {isDropdownOpen && (
            <div
              ref={dropdownRef} // Reference for the dropdown menu
              className="absolute right-0 z-20 w-48 p-3 text-white transition-all duration-300 ease-in-out transform scale-95 bg-blue-600 rounded-lg shadow-lg top-14 group-hover:scale-100"
            >
              <ul>
                {!userDataVer &&
                  <li
                    className="px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-md cursor-pointer hover:bg-blue-400"
                    onClick={sendVerificationOtp}
                  >
                    Verify Email
                  </li>
                }

                <li
                  className="px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-md cursor-pointer hover:bg-blue-400"
                  onClick={logout}
                >
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-5 py-2 text-blue-600 transition-all duration-300 ease-in-out border-2 border-blue-600 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
        >
          <span className="text-lg font-medium">Login</span>
          <img
            src={assets.arrow_icon}
            alt="Arrow Icon"
            className="w-5 h-5 transition-all duration-300 transform hover:translate-x-1"
          />
        </button>
      )}
    </div>
  );
};

export default Navbar;
