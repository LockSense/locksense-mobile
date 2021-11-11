import * as React from 'react';

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
