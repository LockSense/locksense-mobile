import * as React from 'react';

interface TextFieldProps {
  id: string;
  label: string;
}

const TextField: React.FC<TextFieldProps> = ({ id, label }: TextFieldProps) => {
  return (
    <div className="rounded bg-gray-200 border-b-4 border-gray-300 focus-within:border-purple-600 mb-6 px-3 py-2 transition duration-200">
      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        type="text"
        id={id}
        className="bg-transparent rounded w-full text-gray-700 focus:outline-none"
      />
    </div>
  );
};

export default TextField;
