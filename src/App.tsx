import { MqttClient } from 'mqtt';
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MqttProvider } from './hooks/useMqtt';
import ImageCapture from './pages/ImageCapture';
import Login from './pages/Login';

function App(): React.ReactElement {
  const [mqttClient, setMqttClient] = useState<MqttClient>();

  return (
    <MqttProvider value={{ mqttClient, setMqttClient }}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/sensor/login" />} />
        <Route path="/sensor">
          <Route path="login" element={<Login />} />
          <Route path="camera" element={<ImageCapture />} />
        </Route>
      </Routes>
    </MqttProvider>
  );
}

export default App;
