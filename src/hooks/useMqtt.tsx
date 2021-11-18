import { MqttClient } from 'mqtt';
import React, { Dispatch, SetStateAction, useContext } from 'react';
import { ConnectionState } from '../utils/mqtt';

type MqttContextValue = {
  mqttClient?: MqttClient;
  setMqttClient: Dispatch<SetStateAction<MqttClient | undefined>>;
  connectionState: ConnectionState;
  setConnectionState: React.Dispatch<React.SetStateAction<ConnectionState>>;
};

const MqttContext = React.createContext<MqttContextValue>({
  setMqttClient: (client) => console.error('setMqttClient not initialised'),
  connectionState: ConnectionState.NOT_CONNECTED,
  setConnectionState: (state) => console.error('setConnectionState not initialised'),
});

export const MqttProvider = (props: React.ProviderProps<MqttContextValue>) => (
  <MqttContext.Provider {...props} />
);

export const useMqtt = () => useContext(MqttContext);
