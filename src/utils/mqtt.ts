import Cookies from 'js-cookie';
import { connect, MqttClient, OnMessageCallback } from 'mqtt';
import toast from 'react-hot-toast';
import env from '../env';
import { InferenceResult, messageMap } from './results';

export enum ConnectionState {
  CONNECTED = 'Connected',
  CONNECTING = 'Connecting',
  RECONNECTING = 'Reconnecting',
  NOT_CONNECTED = 'Not connected',
}

export const connectionURL = (host: string) => `${env.MQTT_PROTOCOL}://${host}:${env.MQTT_PORT}`;

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

export const setUpSubscriptions = (client: MqttClient, doorID: string) => {
  const topics = [env.IMAGE_CONNECT_TOPIC, `${doorID}/${env.VERDICT_TOPIC}`];
  client.subscribe(topics, (err, granted) => {
    console.log(`Subscribed to topic(s) '${granted.map((grant) => grant.topic).join("', '")}'`);

    client.publish(
      env.IMAGE_CONNECT_TOPIC,
      `${getClientID()} connected as ${doorID}!`,
      {},
      (err) => {
        if (err) {
          console.error('Failed to publish message', err);
        }
      },
    );
  });
};

interface VerdictMessage {
  fileName: string;
  response: InferenceResult;
}

export const onMessage =
  (doorID: string): OnMessageCallback =>
  (topic, message, packet) => {
    console.log(`[${topic}] Received Message:`, message.toString(), packet);
    if (topic === `${doorID}/${env.VERDICT_TOPIC}`) {
      const payload = JSON.parse(message.toString()) as VerdictMessage;
      switch (payload.response) {
        case InferenceResult.LOCK_PICK:
          toast.error(messageMap[payload.response]);
          return;
        case InferenceResult.UNLOCK:
          toast.success(messageMap[payload.response]);
          return;
        case InferenceResult.EMPTY:
          return;
      }
    }
  };

export const createMqttClient = (url: string, username: string, password: string): MqttClient => {
  const clientId = getClientID();
  const client = connect(url, {
    clientId,
    clean: true,
    username,
    password,
    connectTimeout: 4000,
    reconnectPeriod: 2000,
    // Allow self-signed cert
    rejectUnauthorized: false,
  });
  return client;
};
