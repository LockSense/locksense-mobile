import { Form, Formik } from 'formik';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '../components/buttons/Button';
import TextField from '../components/forms/TextField';
import env from '../env';
import { useMqtt } from '../hooks/useMqtt';
import {
  ConnectionState,
  connectionURL,
  createMqttClient,
  logMessage,
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

  // FIXME: don't use alerts for feedback

  const handleSubmit = (values: LoginForm) => {
    // No need to re-connect if the client has already been set up.
    if (mqttClient) {
      alert(`Connection status: ${connectionState}`);
      if (connectionState === ConnectionState.CONNECTED) {
        navigate('../camera');
      }
      return;
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
      alert('Connected!');
      setConnectionState(ConnectionState.CONNECTED);

      setUpSubscriptions(client);
      navigate('../camera');
    });
    client.on('reconnect', () => {
      console.log('Reconnecting...');
      setConnectionState(ConnectionState.RECONNECTING);
    });
    client.on('message', logMessage);
    client.on('error', (error) => {
      alert(
        `An error occurred while connecting to the MQTT broker.\n ${error.name}: ${error.message}`,
      );
      client.end();
      setMqttClient(undefined);
      setConnectionState(ConnectionState.NOT_CONNECTED);
    });

    alert(`Connection status: ${connectionState}. Please wait a while.`);
  };

  return (
    <>
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
