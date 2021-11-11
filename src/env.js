const env = {
  MQTT_PROTOCOL: 'wss',
  MQTT_HOST: 'locksense.dorcastan.com',
  MQTT_PORT: 9001,
  // TODO: use user-provided username + password. This is not secure.
  MQTT_USERNAME: process.env.REACT_APP_MQTT_USERNAME ?? '',
  MQTT_PASSWORD: process.env.REACT_APP_MQTT_PASSWORD ?? '',
};

export default env;
