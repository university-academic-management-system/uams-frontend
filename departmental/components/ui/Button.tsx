// components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  children,
  variant = 'secondary',
  className = '',
  ...props
}: ButtonProps) => {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  return (
    <button
      className={`px-6 py-2.5 rounded-lg font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};