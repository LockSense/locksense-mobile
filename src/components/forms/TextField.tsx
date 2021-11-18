import { useField } from 'formik';
import * as React from 'react';

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export interface TextFieldProps extends InputProps {
  name: string;
  label: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, ...props }: TextFieldProps) => {
  const [field, meta] = useField(props);

  const hasError = meta.touched && meta.error;

  return (
    <div className={'mb-6'}>
      <div className="rounded bg-gray-200 border-b-4 border-gray-300 focus-within:border-purple-600 px-3 py-2 transition duration-200">
        <label
          className="text-gray-700 text-sm font-bold mb-1"
          htmlFor={props.id || props.name}
        >
          {label}
          {hasError ? (
            <div className="inline text-xs text-red-500 ml-1 px-3 pt-1">{meta.error}</div>
          ) : null}
        </label>
        <input
          type="text"
          {...field}
          {...props}
          className="bg-transparent rounded w-full text-gray-700 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TextField;
