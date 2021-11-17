import { MqttClient } from 'mqtt';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router';
import Button from '../components/buttons/Button';
import env from '../env';
import useInterval from '../hooks/useInterval';
import { useMqtt } from '../hooks/useMqtt';
import { convertToRGBArray, IMG_HEIGHT, IMG_WIDTH } from '../utils/image';
import { ConnectionState } from '../utils/mqtt';

const getImageFilename = () => `${new Date().toISOString()}.jpg`;

const publishToMQTT = (client: MqttClient, imageData: Uint8ClampedArray) => {
  const filename = getImageFilename();
  const data = convertToRGBArray(imageData, IMG_WIDTH, IMG_HEIGHT);
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
  const [shouldStream, setShouldStream] = useState(false);
  const [imgSources, setImgSources] = useState<string[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    setUpVideoStream().then(() => setIsLoading(false));
    return cleanUpMediaStream;
    // changes to cleanUpMediaStream should not cause a re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => captureFrame(), shouldStream ? 1000 : null);

  const setUpVideoStream = async () => {
    if (!navigator.mediaDevices || !videoRef.current) {
      return;
    }
    const constraints: MediaStreamConstraints = {
      video: { width: IMG_WIDTH, height: IMG_HEIGHT, facingMode: 'environment', frameRate: 5 },
    };
    return navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      setMediaStream(stream);
      videoRef.current!.srcObject = stream;
    });
  };

  const cleanUpMediaStream = () => {
    if (!mediaStream) {
      return;
    }
    mediaStream.getTracks().forEach((track) => track.stop());
  };

  if (!mqttClient || connectionState === ConnectionState.NOT_CONNECTED) {
    return <Navigate to="../login" />;
  }

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
        <h5 className="font-bold text-3xl">{'Take a Photo'}</h5>

        {!isLoading && !mediaStream && (
          <p>{'This browser does not support the Media Capture API :('}</p>
        )}

        {/* TODO: error message for permission denied */}

        <canvas ref={canvasRef} width={IMG_WIDTH} height={IMG_HEIGHT} className="hidden" />

        <video ref={videoRef} autoPlay playsInline />

        <Button size="md" onClick={() => setShouldStream(!shouldStream)}>
          {shouldStream ? 'Stop Streaming' : 'Start Streaming'}
        </Button>

        <Button onClick={captureFrame}>{'Take a Snapshot'}</Button>

        {imgSources.length > 0 && (
          <div className="flex justify-center m-2 gap-2">
            {imgSources.map((src) => (
              <img
                key={src}
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
