import { MqttClient } from 'mqtt';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MqttProvider } from './hooks/useMqtt';
import { StoreProvider } from './hooks/useStore';
import CameraView from './pages/CameraView';
import Login from './pages/Login';
import { ConnectionState } from './utils/mqtt';

function App(): React.ReactElement {
  const [store, setStore] = useState({ doorID: '' });
  const [mqttClient, setMqttClient] = useState<MqttClient>();
  const [connectionState, setConnectionState] = useState(ConnectionState.NOT_CONNECTED);

  return (
    <StoreProvider value={{ store, setStore }}>
      <MqttProvider value={{ mqttClient, setMqttClient, connectionState, setConnectionState }}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/sensor/login" />} />
          <Route path="/sensor">
            <Route path="login" element={<Login />} />
            <Route path="camera" element={<CameraView />} />
          </Route>
        </Routes>

        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </MqttProvider>
    </StoreProvider>
  );
}

export default App;
