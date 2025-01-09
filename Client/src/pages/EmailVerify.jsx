import { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const EmailVerify = () => {
  const { backend_URL, getUserData, userDataVer } = useContext(AppContext)
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  useEffect(() => {
    document.getElementById('otp-input-0').focus()
  }, [])

  const handleChange = (e, index) => {
    const value = e.target.value
    if (/[^0-9]/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('Text').slice(0, 6)
    setOtp(pastedData.split(''))
  }

  const VerificationOtp = async () => {
    try {
      const { data } = await axios.post(backend_URL + '/api/auth/send-verify-otp')

      if (data.success) {
        navigate('/email-verify')
        toast.success('OTP Sent to Your Gmail', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          theme: 'colored',
          className: 'toast-success',
        })
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

  const onSubmitHandler = async () => {
    const OTP = otp.join('')
    try {
      const { data } = await axios.post(backend_URL + '/api/auth/verify-account', {
        otp: OTP,
      })

      if (data.success) {
        toast.success('Account verified successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          theme: 'colored',
          className: 'toast-success',
        })
        getUserData()
        navigate('/')
      } else {
        toast.error(data.success, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: true,
          theme: 'colored',
          className: 'toast-error',
        })
      }
    } catch (error) {
      toast.error('Error during OTP verification! Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      })
    }
  }

  const isOtpComplete = !otp.includes('')

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
        <p className="text-sm font-semibold tracking-tight text-gray-800 sm:text-lg">Auth</p>
      </div>
    </div>

      <div className="flex items-center justify-center min-h-screen pt-20">
        {userDataVer ? (
          <div className="w-full p-8 text-center text-gray-800 bg-white rounded-lg shadow-lg sm:w-96">
            <img
              src={assets.Successful}
              alt="Success"
              className="mx-auto mb-4 w-20 h-20 animate__animated animate__fadeIn animate__delay-0.3s"
            />
            <h1 className="mb-2 text-2xl font-semibold">Account Already Verified</h1>
            <p className="mb-4 text-lg text-indigo-300">Your account has been successfully verified.</p>
            <button
              onClick={() => navigate('/')}
              className="py-2.5 px-6 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:bg-gradient-to-l transition duration-300 ease-in-out"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="w-full p-8 text-gray-800 bg-white rounded-lg shadow-lg sm:w-96">
            <h1 className="mb-4 text-2xl font-semibold text-center">Email Verify OTP</h1>
            <p className="mb-6 text-center text-indigo-300">Enter the 6-digit code sent to your Email ID</p>

            <form className="flex justify-center gap-4 mb-6" onPaste={handlePaste}>
              {otp.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  id={`otp-input-${index}`}
                  className="w-12 h-12 text-3xl font-semibold text-center text-gray-800 transition-all duration-300 ease-in-out bg-white border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              ))}
            </form>

            <div className="flex justify-center mt-4">
              <p
                onClick={VerificationOtp}
                className="font-semibold text-blue-600 transition duration-300 ease-in-out cursor-pointer hover:text-blue-500"
              >
                Resend OTP
              </p>
            </div>

            <button
              onClick={onSubmitHandler}
              disabled={!isOtpComplete}
              className={`w-full py-2.5 mt-6 rounded-full ${
                isOtpComplete
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:bg-gradient-to-l'
                  : 'bg-gray-400 text-gray-800 cursor-not-allowed'
              } transition duration-300 ease-in-out`}
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerify
