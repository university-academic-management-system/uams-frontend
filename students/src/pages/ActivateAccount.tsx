import React, { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { getAssetPath } from '../utils/assetPath';

const ActivateAccount: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add activation logic
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-100 overflow-hidden font-sans">
      <div 
        className="absolute inset-0 lg:right-[30%]"
        style={{
          borderTopRightRadius: '40px',
          borderBottomRightRadius: '40px',
          overflow: 'hidden',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/login-image.jpeg`}
          alt="University Building"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative min-h-screen flex items-center justify-center lg:justify-end px-4 lg:pr-20 xl:pr-32">
        <div 
          className="bg-white rounded-[24px] shadow-2xl p-8 sm:p-12 w-full max-w-md z-10 border border-blue-100"
        >
          <div className="flex justify-center mb-8">
            <img src={getAssetPath('assets/spedox.jpg')} alt="UniEdu" className="h-10" />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Activate Account</h2>
            <p className="text-sm text-gray-500">
              Welcome back please activate your account using your email and phone number as username and password respectively
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 py-3.5 pl-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Enter Username"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 py-3.5 pl-4 pr-12 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Enter Password"
              />
              <div 
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                )}
              </div>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                <span className="ml-3 text-sm text-gray-600">Remember me</span>
              </label>
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-xl bg-[#1976D2] py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#1565C0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
            >
              Activate Account
            </button>
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Forgot Password? <a href="#" className="font-medium text-[#1976D2] hover:text-blue-600">Click Here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
