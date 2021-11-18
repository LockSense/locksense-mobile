import * as React from 'react';

type Size = 'sm' | 'md';

const sizeCSS: Record<Size, string> = Object.freeze({
  sm: 'py-2',
  md: 'py-4',
});

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: Size;
};

const Button: React.FC<ButtonProps> = ({ children, size = 'sm', ...props }) => {
  return (
    <button
      className={`bg-purple-600 hover:bg-purple-700 text-white font-bold ${sizeCSS[size]} rounded shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition duration-200`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
