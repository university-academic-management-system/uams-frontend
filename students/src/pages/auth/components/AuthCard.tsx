import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  isPlainLogo?: boolean;
}

const AuthCard: React.FC<AuthCardProps> = ({
  children,
  className = "",
  isPlainLogo = true,
}) => (
  <div
    className={`relative z-10 w-full max-w-[500px] bg-white p-8 md:p-12 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-500 mx-4 ${className}`}
  >
    <div className="flex justify-center mb-8">
      <img
        src={`${import.meta.env.BASE_URL}assets/uphcscLG.png`}
        alt="UniEdu Logo"
        className="h-12"
        onError={(e: any) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
    {children}
  </div>
);

export default AuthCard;
