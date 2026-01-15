import React from 'react';

const AuthBackground: React.FC = () => (
  <div className="fixed inset-0 w-full h-full z-0 font-['Inter']">
    <img
      src={`${import.meta.env.BASE_URL}assets/login-image.png`}
      alt="UAMS Login Background"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/40"></div>
  </div>
);

export default AuthBackground;
