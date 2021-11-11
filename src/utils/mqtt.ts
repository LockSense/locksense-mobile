import env from '../env';

export const connectionURL = `${env.MQTT_PROTOCOL}://${env.MQTT_HOST}:${env.MQTT_PORT}`;

export const generateRandomClientID = () => `mqtt_${Math.random().toString(16).slice(3)}`;
