import React from 'react';
import { Routes, Route } from 'react-router';
import Login from './pages/Login';

function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
