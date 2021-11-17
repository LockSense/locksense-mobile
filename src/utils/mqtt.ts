import Cookies from 'js-cookie';
import { connect, MqttClient, OnMessageCallback } from 'mqtt';
import env from '../env';

export enum ConnectionState {
  CONNECTED = 'Connected',
  CONNECTING = 'Connecting',
  RECONNECTING = 'Reconnecting',
  NOT_CONNECTED = 'Not connected',
}

export const connectionURL = `${env.MQTT_PROTOCOL}://${env.MQTT_HOST}:${env.MQTT_PORT}`;

/* Client ID */

const COOKIE_NAME = 'ls_cid';
const MAX_COOKIE_AGE = 2147483647;

const generateRandomClientID = () => `web_${Math.random().toString(16).slice(3)}`;

export const getClientID = () => {
  const savedID = Cookies.get(COOKIE_NAME);
  if (savedID) {
    return savedID;
  }

  const newID = generateRandomClientID();
  Cookies.set(COOKIE_NAME, newID, { expires: MAX_COOKIE_AGE });
  return newID;
};

/* Utility functions */

export const setUpSubscriptions = (client: MqttClient) => {
  const topics = ['test', 'helloworld'];
  client.subscribe(topics, (err, granted) => {
    console.log(`Subscribed to topic(s) '${granted.map((grant) => grant.topic).join("', '")}'`);

    client.publish('test', 'This works!', {}, (err) => {
      if (err) {
        console.error('Failed to publish message', err);
      }
    });
  });
};

export const logMessage: OnMessageCallback = (topic, message, packet) => {
  console.log(`[${topic}] Received Message:`, message.toString(), packet);
};

export const createMqttClient = (url: string, username: string, password: string): MqttClient => {
  const clientId = getClientID();
  const client = connect(url, {
    clientId,
    clean: true,
    username,
    password,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  });
  return client;
};
