import React from 'react';
import { Routes, Route } from 'react-router';
import ImageCapture from './pages/ImageCapture';
import Login from './pages/Login';

function App(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/camera" element={<ImageCapture />} />
    </Routes>
  );
}

export default App;
