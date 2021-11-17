import { MqttClient } from 'mqtt';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router';
import Button from '../components/buttons/Button';
import SwitchHorizontalIcon from '../components/icons/SwitchHorizontal';
import env from '../env';
import useInterval from '../hooks/useInterval';
import { useMqtt } from '../hooks/useMqtt';
import { convertToRGBArray, IMG_HEIGHT, IMG_WIDTH } from '../utils/image';
import { ConnectionState } from '../utils/mqtt';

enum ViewMode {
  ENVIRONMENT = 'environment',
  USER = 'user',
}

const getImageFilename = () => `${new Date().toISOString()}.jpg`;

const getVideoStream = async (viewMode = ViewMode.ENVIRONMENT) => {
  if (!navigator.mediaDevices) {
    return;
  }
  const constraints: MediaStreamConstraints = {
    video: { width: IMG_WIDTH, height: IMG_HEIGHT, facingMode: viewMode, frameRate: 5 },
  };
  return navigator.mediaDevices.getUserMedia(constraints);
};

const cleanUpMediaStream = (mediaStream: MediaStream) => {
  mediaStream.getTracks().forEach((track) => track.stop());
};

const publishToMQTT = (client: MqttClient, imageData: Uint8ClampedArray) => {
  const filename = getImageFilename();
  const data = convertToRGBArray(imageData, IMG_WIDTH, IMG_HEIGHT);
  // TODO: device ID
  const payload = JSON.stringify({ filename, data });
  client.publish(env.IMAGE_CHANNEL, payload, () => {
    console.log('published:', filename);
  });
};

const CameraView: React.FC = () => {
  const { mqttClient, connectionState } = useMqtt();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);

  const [viewMode, setViewMode] = useState(ViewMode.ENVIRONMENT);
  const [error, setError] = useState('');
  const [imgSources, setImgSources] = useState<string[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    let mediaStreamReference: MediaStream | undefined;
    getVideoStream(viewMode)
      .then(setUpVideoStream)
      .then((stream) => (mediaStreamReference = stream))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
    return () => {
      if (!mediaStreamReference) return;
      cleanUpMediaStream(mediaStreamReference);
    };
    // changes to cleanUpMediaStream should not cause a re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  useInterval(() => captureFrame(), isStreaming ? 1000 : null);

  const setUpVideoStream = (stream: MediaStream | undefined) => {
    setMediaStream(stream);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return stream;
  };

  if (!mqttClient || connectionState === ConnectionState.NOT_CONNECTED) {
    return <Navigate to="../login" />;
  }

  const toggleIsStreaming = () => setIsStreaming(!isStreaming);

  const toggleViewMode = () => {
    setViewMode(viewMode === ViewMode.ENVIRONMENT ? ViewMode.USER : ViewMode.ENVIRONMENT);
  };

  const addImageSource = (src: string) => {
    const numImages = imgSources.length;
    const newImgSources = imgSources.slice(numImages - 2, numImages);
    newImgSources.push(src);
    setImgSources(newImgSources);
  };

  const captureFrame = () => {
    if (!canvasRef.current || !videoRef.current) {
      console.error('refs not present');
      return;
    }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      console.error('no context in canvasRef');
      return;
    }
    ctx.drawImage(videoRef.current, 0, 0);

    const imageURL = canvasRef.current.toDataURL();
    addImageSource(imageURL);

    const imageData = ctx.getImageData(0, 0, IMG_WIDTH, IMG_HEIGHT).data;
    publishToMQTT(mqttClient, imageData);
  };

  return (
    <main className="bg-white max-w-lg min-h-full mx-auto p-8 md:p-12 my-10 rounded-lg md:shadow-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h5 className="font-bold text-3xl">{'Video Monitor'}</h5>
          <button
            className="rounded-full h-9 w-9 flex justify-center items-center shadow"
            onClick={toggleViewMode}
          >
            <SwitchHorizontalIcon />
          </button>
        </div>

        {!isLoading && !error && !mediaStream && (
          <p>{'This browser does not support the Media Capture API :('}</p>
        )}

        {!isLoading && error && (
          <p>
            {'Unable to open the camera :('}
            <br />
            {error.toString()}
            <br />
            {'Please update permissions and refresh the page.'}
          </p>
        )}

        <canvas
          ref={canvasRef}
          width={IMG_WIDTH}
          height={IMG_HEIGHT}
          className={isStreaming ? '' : 'hidden'}
        />

        <video ref={videoRef} autoPlay playsInline className={!isStreaming ? '' : 'hidden'} />

        <Button size="md" onClick={toggleIsStreaming} disabled={!mediaStream}>
          {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
        </Button>

        <Button onClick={captureFrame} disabled={!mediaStream}>
          {'Take a Snapshot'}
        </Button>

        {imgSources.length > 0 && (
          <div className="flex justify-center m-2 gap-2">
            {imgSources.map((src, i) => (
              <img
                key={`${src}${i}`}
                src={src}
                alt={'from camera'}
                className="flex-initial shadow-md w-1/3"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CameraView;
