import { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
  const { backend_URL } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step === 2) document.getElementById('otp-input-0').focus();
  }, [step]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text').slice(0, 6);
    setOtp(pastedData.split(''));
  };

  const sendOtp = async () => {
    if (!email) {
      toast.error('Please enter a valid email address', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      });
      return;
    }

    try {
      const { data } = await axios.post(`${backend_URL}/api/auth/send-reset-otp`, { email });

      if (data.success) {
        setStep(2);
        toast.success('OTP sent to your email', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          theme: 'colored',
          className: 'toast-success',
        });
      } else {
        toast.error(data.message || 'Failed to send OTP', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          theme: 'colored',
          className: 'toast-error',
        });
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

  const onSubmitHandler = async () => {
    const OTP = otp.join('');
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter both new password and confirmation password', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      });
      return;
    }

    try {
      const { data } = await axios.post(`${backend_URL}/api/auth/reset-password`, {
        email,
        otp: OTP,
        newPassword,
      });

      if (data.success) {
        toast.success('Password reset successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeButton: true,
          theme: 'colored',
          className: 'toast-success',
        });
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: true,
          theme: 'colored',
          className: 'toast-error',
        });
      }
    } catch (error) {
      toast.error('Error during password reset! Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeButton: true,
        theme: 'colored',
        className: 'toast-error',
      });
    }
  };

  const isOtpComplete = !otp.includes('');
  const isFormValid = isOtpComplete && newPassword && confirmPassword;

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
        <div className="w-full p-8 text-gray-800 bg-white rounded-lg shadow-lg sm:w-96">
          <h1 className="mb-4 text-2xl font-semibold text-center">Reset Your Password</h1>

          {step === 1 && (
            <>
              <p className="mb-6 text-center text-indigo-300">Enter your Email to receive OTP</p>
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 mb-6 transition-all duration-300 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendOtp}
                className="w-full py-2.5 mt-6 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:bg-gradient-to-l focus:ring-2 focus:ring-indigo-500"
              >
                Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-6 text-center text-indigo-300">Enter the 6-digit OTP sent to your Email</p>
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
                    className="w-12 h-12 text-3xl font-semibold text-center transition-all duration-300 ease-in-out border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
              </form>
              <button
                onClick={() => setStep(3)}
                disabled={!isOtpComplete}
                className={`w-full py-2.5 mt-6 rounded-full ${isOtpComplete ? 'bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:bg-gradient-to-l focus:ring-2 focus:ring-indigo-500' : 'bg-gray-400 text-gray-800 cursor-not-allowed'}`}
              >
                Next
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="mb-6 text-center text-indigo-300">Enter Your New Password</p>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-3 mb-6 transition-all duration-300 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="password"
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 mb-6 transition-all duration-300 ease-in-out border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={onSubmitHandler}
                disabled={!isFormValid}
                className={`w-full py-2.5 mt-6 rounded-full ${isFormValid ? 'bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:bg-gradient-to-l focus:ring-2 focus:ring-indigo-500' : 'bg-gray-400 text-gray-800 cursor-not-allowed'}`}
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
