import * as React from 'react';
import TextField from '../components/forms/TextField';

const Login: React.FC = () => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) =>
    alert(`Hello, ${Object.keys(event)}`);

  return (
    <>
      <main className="bg-white max-w-lg min-h-full mx-auto p-8 md:p-12 my-10 rounded-lg md:shadow-2xl">
        <section>
          <h3 className="font-bold text-2xl">Welcome to LockSense</h3>
          <p className="text-gray-600 pt-2">Sign in to your account.</p>
        </section>

        <section className="mt-10">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <TextField id={'username'} label={'Username'} />
            <TextField id={'password'} label={'Password'} />
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
              type="submit"
            >
              Sign In
            </button>
          </form>
        </section>
      </main>

      <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <a href="register" className="font-bold hover:underline">
            Register
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default Login;
