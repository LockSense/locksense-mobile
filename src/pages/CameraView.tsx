import React, { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router';
import { useMqtt } from '../hooks/useMqtt';
import { convertToRGBArray, IMG_HEIGHT, IMG_WIDTH } from '../utils/image';
import { ConnectionState, IMAGE_CHANNEL } from '../utils/mqtt';

const CameraView: React.FC = () => {
  const { mqttClient, connectionState } = useMqtt();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [imgSources, setImgSources] = useState<string[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream>();

  useEffect(() => {
    setUpVideoStream().then(() => setIsLoading(false));
    return cleanUpMediaStream;
    // changes to cleanUpMediaStream should not cause a re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // Send image via MQTT
    const imageData = ctx.getImageData(0, 0, IMG_WIDTH, IMG_HEIGHT).data;
    const filename = `${new Date()}.jpg`;
    const payload = { filename, data: convertToRGBArray(imageData, IMG_WIDTH, IMG_HEIGHT) };
    mqttClient.publish(IMAGE_CHANNEL, JSON.stringify(payload), () =>
      console.log('published:', payload),
    );
  };

  return (
    <main className="bg-white max-w-lg min-h-full mx-auto p-8 md:p-12 my-10 rounded-lg md:shadow-2xl">
      <div className="flex flex-col gap-4">
        <h5 className="font-bold text-3xl">{'Take a Photo'}</h5>

        {!isLoading && !mediaStream && (
          <p>{'This browser does not support the Media Capture API :('}</p>
        )}

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

        {/* TODO: error message for permission denied */}

        <canvas ref={canvasRef} width={IMG_WIDTH} height={IMG_HEIGHT} className="hidden" />

        <video ref={videoRef} autoPlay playsInline />

        <button
          id="camera--trigger"
          className="bg-purple-600 hover:bg-purple-700 text-white text-center font-bold py-4 min-w-full rounded shadow-lg hover:shadow-xl transition duration-200"
          onClick={captureFrame}
        >
          {'Take a Snapshot'}
        </button>
      </div>
    </main>
  );
};

export default CameraView;
