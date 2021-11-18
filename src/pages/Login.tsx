import { Form, Formik } from 'formik';
import * as React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import TextField from '../components/forms/TextField';
import ChoiceModal from '../components/modals/ChoiceModal';
import env from '../env';
import { useMqtt } from '../hooks/useMqtt';
import { useStore } from '../hooks/useStore';
import {
  ConnectionState,
  connectionURL,
  createMqttClient,
  onMessage,
  setUpSubscriptions,
} from '../utils/mqtt';

interface LoginForm {
  hostname: string;
  username: string;
  password: string;
}

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const Login: React.FC = () => {
  const { mqttClient, setMqttClient, connectionState, setConnectionState } = useMqtt();
  const navigate = useNavigate();
  const { setStore } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (values: LoginForm) => {
    // No need to re-connect if the client has already been set up.
    if (mqttClient) {
      toast(`Connection status: ${connectionState}`, { duration: 2000 });
      switch (connectionState) {
        case ConnectionState.CONNECTED:
          navigate('../camera');
          return;
        case ConnectionState.CONNECTING:
          return;
      }
    }

    const client = createMqttClient(
      connectionURL(values.hostname),
      values.username,
      values.password,
    );
    setMqttClient(client);
    setConnectionState(ConnectionState.CONNECTING);

    // TODO: extract out into separate functions
    client.on('connect', (packet) => {
      toast('Connected!', { duration: 2000 });
      setConnectionState(ConnectionState.CONNECTED);
      setIsModalOpen(true);
    });
    client.on('reconnect', () => {
      toast('Reconnecting...', { id: 'mqttReconnecting', duration: 2000 });
      setConnectionState(ConnectionState.RECONNECTING);
    });
    client.on('error', (error) => {
      toast.error(
        `An error occurred while connecting to the MQTT broker.\n ${error.name}: ${error.message}`,
      );
      client.end();
      setMqttClient(undefined);
      setConnectionState(ConnectionState.NOT_CONNECTED);
    });

    toast(`Connection status: ${connectionState}. Please wait a while.`, { duration: 1000 });
  };

  const handleModalClick = (index: number) => {
    // TODO: figure out error handling
    if (!mqttClient) return;

    const doorID = index === 0 ? 'door1' : 'door2';
    setUpSubscriptions(mqttClient, doorID);
    mqttClient.on('message', onMessage(doorID));

    setStore({ doorID });
    navigate('../camera');
  };

  return (
    <>
      {isModalOpen && (
        <ChoiceModal
          title="Which door set is this?"
          content="It decides how your data is streamed and matched with audio input."
          buttonLabels={['Door 1', 'Door 2']}
          onClick={handleModalClick}
        />
      )}

      <main className="bg-white max-w-lg min-h-full mx-auto p-8 md:p-12 my-10 rounded-lg md:shadow-2xl">
        <section>
          <h3 className="font-bold text-2xl">Welcome to LockSense</h3>
          <p className="text-gray-600 pt-2">{'Sign in to your account.'}</p>
        </section>

        <section className="mt-10">
          <Formik
            initialValues={{ hostname: env.MQTT_HOST, username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <Form className="flex flex-col">
                <TextField name={'hostname'} label={'Host'} />
                <TextField name={'username'} label={'Username'} />
                <TextField type="password" name={'password'} label={'Password'} />
                <Button disabled={!formik.isValid} type="submit">
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
        </section>
      </main>

      <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-gray-600">{`Status: ${connectionState}`}</p>
      </div>
    </>
  );
};

export default Login;
