import { useContext } from 'react';
import { assets } from '../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center px-6 py-16 mt-20 text-center text-gray-800 -z-10 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      {/* Profile Image */}
      <img
        src={assets.header_img}
        alt="Profile"
        className="mb-6 transition duration-300 ease-in-out transform border-4 border-blue-500 rounded-full shadow-xl w-36 h-36 hover:scale-110"
      />

      {/* Main Heading */}
      <h1 className="text-3xl font-semibold text-gray-800 sm:text-4xl lg:text-5xl animate__animated animate__fadeInUp animate__delay-1s">
        Hey {userData ? userData : 'Developer'}! <img src={assets.hand_wave} alt="Wave" className="inline-block w-8 aspect-square animate__animated animate__tada animate__delay-2s" />
      </h1>

      {/* Subheading */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-600 mt-4 sm:mt-2 animate__animated animate__fadeInUp animate__delay-1.5s">
        Welcome to Our App, where creativity meets functionality!
      </h2>

      {/* Description */}
      <p className="max-w-3xl mx-auto mt-6 text-lg text-gray-500 animate__animated animate__fadeIn animate__delay-2s">
        We're thrilled to have you onboard. This app is designed to help you build, explore, and innovate with ease. Get ready to experience a seamless and intuitive interface that empowers you to achieve more. Start your journey today and discover a world of possibilities.
      </p>

      {/* Get Started Button */}
      <button className="px-8 py-4 mt-6 text-xl font-medium text-white transition duration-300 ease-in-out transform bg-blue-600 rounded-lg shadow-xl hover:bg-blue-700 hover:scale-110">
        Get Started
      </button>

      {/* Social Media Links */}
      <div className="flex mt-10 space-x-8 animate__animated animate__fadeIn animate__delay-2s">
        <a
          href="https://x.com/DebjyotiSh27921"
          className="text-3xl text-blue-500 transition-all duration-300 transform hover:text-blue-600 hover:scale-110"
        >
          <img src={assets.x} alt="X Logo" className="w-8 h-8" />
        </a>
        <a
          href="https://github.com/Debjyoti2004"
          className="text-3xl text-gray-700 transition-all duration-300 transform hover:text-gray-800 hover:scale-110"
        >
          <FontAwesomeIcon icon={faGithub} className="w-8 h-8" />
        </a>
        <a
          href="https://www.linkedin.com/in/debjyotishit/"
          className="text-3xl text-blue-700 transition-all duration-300 transform hover:text-blue-800 hover:scale-110"
        >
          <FontAwesomeIcon icon={faLinkedin} className="w-8 h-8" />
        </a>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 gap-10 px-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 transition duration-300 ease-in-out bg-white rounded-lg shadow-lg hover:shadow-xl">
          <div className="mb-4 text-4xl text-blue-500">
            <i className="fas fa-cogs"></i>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">Customizable Experience</h3>
          <p className="text-gray-600">Tailor the app to fit your needs. Customize your settings, preferences, and layout for an optimized user experience.</p>
        </div>
        <div className="p-6 transition duration-300 ease-in-out bg-white rounded-lg shadow-lg hover:shadow-xl">
          <div className="mb-4 text-4xl text-purple-500">
            <i className="fas fa-cloud"></i>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">Cloud Integration</h3>
          <p className="text-gray-600">Store your data securely in the cloud and access it from anywhere, anytime. Stay connected across devices seamlessly.</p>
        </div>
        <div className="p-6 transition duration-300 ease-in-out bg-white rounded-lg shadow-lg hover:shadow-xl">
          <div className="mb-4 text-4xl text-pink-500">
            <i className="fas fa-lock"></i>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">Top-notch Security</h3>
          <p className="text-gray-600">We prioritize your privacy with advanced encryption and security measures. Your data is always protected.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-6 py-4 mt-12 text-right text-gray-500">
        <p className="font-medium">© 2025 OurApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Header;
