import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate();
  const { backend_URL, setIsLoggedin, getUserData } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true

      if (state === 'Sign Up') {
        const { data } = await axios.post(backend_URL + '/api/auth/register', { name, email, password })

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          toast.success('Registration Successful!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: true,
            theme: 'colored',
            className: 'toast-success',
          })
          navigate('/') 
        } else {
          toast.error(data.message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeButton: true,
            theme: 'colored',
            className: 'toast-error',
          })
        }
      } else {
        const { data } = await axios.post(backend_URL + '/api/auth/login', { email, password })

        if (data.success) {
          setIsLoggedin(true);
          getUserData(); 
          toast.success('Login Successful!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: true,
            theme: 'colored',
            className: 'toast-success',
          });
          navigate('/'); 
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
      }
    } catch (error) {
      toast.error(error.response?.data.message || 'Something went wrong! Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-300">
      <div className="fixed z-50 flex items-center justify-between w-full p-4 bg-white rounded-b-lg shadow-md">
        <div className="flex items-center space-x-2">
          <img
            onClick={() => navigate('/')}
            src={assets.picture}
            alt="Logo"
            className="w-10 p-1 transition-all duration-300 transform border-2 border-gray-300 rounded-full sm:w-12 hover:scale-110 hover:rotate-6 hover:shadow-md"
          />
          <p className="text-lg font-semibold tracking-tight text-gray-800 sm:text-xl">Auth</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-0">
        <div className="w-full p-10 transition duration-500 ease-in-out transform bg-white rounded-lg shadow-lg sm:w-96 hover:scale-105 hover:shadow-2xl">
          <h2 className="mb-3 text-3xl font-semibold text-center text-gray-800">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </h2>
          <p className="mb-6 text-sm text-center text-gray-600">
            {state === 'Sign Up' ? 'Create your account to get started' : 'Login to your account!'}
          </p>

          <form onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-indigo-50 transition duration-300 transform hover:scale-105 hover:shadow-md">
                <img src={assets.person_icon} alt="Full Name" />
                <input
                  className="w-full text-gray-800 placeholder-gray-400 bg-transparent rounded-lg outline-none focus:ring-0 focus:border-0 focus:outline-none"
                  onChange={(e) => setName(e.target.value)} 
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-indigo-50 transition duration-300 transform hover:scale-105 hover:shadow-md">
              <img src={assets.mail_icon} alt="Email" />
              <input
                className="w-full text-gray-800 placeholder-gray-400 bg-transparent rounded-lg outline-none focus:ring-0 focus:border-0 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                type="email"
                placeholder="Email ID"
                required
              />
            </div>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-indigo-50 transition duration-300 transform hover:scale-105 hover:shadow-md">
              <img src={assets.lock_icon} alt="Password" />
              <input
                className="w-full text-gray-800 placeholder-gray-400 bg-transparent rounded-lg outline-none focus:ring-0 focus:border-0 focus:outline-none"
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <p onClick={() => navigate('/reset_password')} className="mb-4 text-sm text-indigo-500 cursor-pointer hover:underline">
              Forgot password?
            </p>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:bg-gradient-to-l transition duration-300 ease-in-out"
            >
              {state}
            </button>
          </form>

          {state === 'Sign Up' ? (
            <p className="mt-4 text-xs text-center text-gray-400">
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-blue-400 underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="mt-4 text-xs text-center text-gray-400">
              Don't have an account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-blue-400 underline cursor-pointer"
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
