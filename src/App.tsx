import React from 'react';

function App() {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => alert(`Hello, ${Object.keys(event)}`)
  
  return (
    <>
    <main className="bg-white max-w-lg min-h-full mx-auto p-8 md:p-12 my-10 rounded-lg md:shadow-2xl">
        <section>
            <h3 className="font-bold text-2xl">Welcome to LockSense</h3>
            <p className="text-gray-600 pt-2">Sign in to your account.</p>
        </section>

        <section className="mt-10">
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="rounded bg-gray-200 border-b-4 border-gray-300 focus-within:border-purple-600 mb-6 px-3 py-2 transition duration-200">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="username">Username</label>
                    <input type="text" id="username" className="bg-transparent rounded w-full text-gray-700 focus:outline-none" />
                </div>
                <div className="rounded bg-gray-200 border-b-4 border-gray-300 focus-within:border-purple-600 mb-6 px-3 py-2 transition duration-200">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">Password</label>
                    <input type="text" id="password" className="bg-transparent rounded w-full text-gray-700 focus:outline-none" />
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" type="submit">Sign In</button>
            </form>
        </section>
    </main>

    <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-gray-600">Don't have an account? <a href="register" className="font-bold hover:underline">Register</a>.</p>
    </div>
  </>
  );
}

export default App;
