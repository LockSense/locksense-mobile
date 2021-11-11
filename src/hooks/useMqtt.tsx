import { MqttClient } from 'mqtt';
import React, { Dispatch, SetStateAction, useContext } from 'react';

type MqttContextValue = {
  mqttClient?: MqttClient;
  setMqttClient?: Dispatch<SetStateAction<MqttClient | undefined>>;
};

const MqttContext = React.createContext<MqttContextValue>({});

export const MqttProvider = (props: React.ProviderProps<MqttContextValue>) => (
  <MqttContext.Provider {...props} />
);

export const useMqtt = () => useContext(MqttContext);
