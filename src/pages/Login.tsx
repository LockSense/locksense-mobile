import { connect, MqttClient, OnMessageCallback } from 'mqtt';
import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextField from '../components/forms/TextField';
import env from '../env';
import { useMqtt } from '../hooks/useMqtt';
import { connectionURL, generateRandomClientID } from '../utils/mqtt';

const onConnect = (client: MqttClient) => () => {
  console.log('Connected');

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

const onMessage: OnMessageCallback = (topic, message, packet) => {
  console.log(`[${topic}] Received Message:`, message.toString(), packet);
};

const createMqttClient = (url: string, username: string, password: string): MqttClient => {
  const clientId = generateRandomClientID();
  const client = connect(url, {
    clientId,
    clean: true,
    username,
    password,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  });
  client.on('connect', onConnect(client));
  client.on('message', onMessage);
  return client;
};

const Login: React.FC = () => {
  const { mqttClient, setMqttClient } = useMqtt();

  useEffect(() => {
    // No need to re-connect if the client has already been set up.
    if (mqttClient) return;
    // Can't do anything unless the set state action exists.
    if (!setMqttClient) return;

    // TODO: use user-provided username + password. Do this on form submit instead.
    const client = createMqttClient(connectionURL, env.MQTT_USERNAME, env.MQTT_PASSWORD);
    setMqttClient(client);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    alert(`Hello, ${Object.keys(event)}`);
  };

  return (
    <>
      <main className="bg-white max-w-lg min-h-full mx-auto p-8 md:p-12 my-10 rounded-lg md:shadow-2xl">
        <section>
          <h3 className="font-bold text-2xl">Welcome to LockSense</h3>
          <p className="text-gray-600 pt-2">Sign in to your account.</p>
        </section>

        <section className="mt-10">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <TextField id={'username'} label={'Username'} />
            <TextField id={'password'} label={'Password'} />
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
              type="submit"
            >
              Sign In
            </button>
          </form>
        </section>
      </main>

      <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="../register" className="font-bold hover:underline">
            Register
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default Login;
