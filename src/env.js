const env = {
  MQTT_PROTOCOL: 'wss',
  MQTT_HOST: 'locksense.dorcastan.com',
  MQTT_PORT: 9001,

  IMAGE_CONNECT_TOPIC: 'image/connect',
  IMAGE_DATA_TOPIC: 'image/data',
  IMAGE_TRIGGER_TOPIC: 'image/trigger',
  VERDICT_TOPIC: 'door1/verdict', // FIXME: account for multiple devices
};

export default env;
