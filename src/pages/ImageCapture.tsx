import React, { useEffect, useRef, useState } from 'react';

const IMG_WIDTH = 500;
const IMG_HEIGHT = 500;

const ImageCapture: React.FC = () => {
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
    addImageSource(canvasRef.current.toDataURL());
  };

  const handleCapture = (target: EventTarget & HTMLInputElement) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        addImageSource(newUrl);
      }
    }
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
              <img src={src} alt={'from camera'} className="flex-initial shadow-md w-1/3" />
            ))}
          </div>
        )}

        <canvas ref={canvasRef} width={IMG_WIDTH} height={IMG_HEIGHT} className="hidden" />

        <video ref={videoRef} autoPlay playsInline />

        <button
          id="camera--trigger"
          className="bg-purple-600 hover:bg-purple-700 text-white text-center font-bold py-4 min-w-full rounded shadow-lg hover:shadow-xl transition duration-200"
          onClick={captureFrame}
        >
          {'Take a Snapshot'}
        </button>

        <input
          accept="image/*"
          className="hidden"
          id="icon-button-file"
          type="file"
          capture="environment"
          onChange={(e) => handleCapture(e.target)}
        />
        <label htmlFor="icon-button-file">
          <div
            className="bg-purple-600 hover:bg-purple-700 text-white text-center font-bold py-4 min-w-full rounded shadow-lg hover:shadow-xl transition duration-200"
            style={{ cursor: 'pointer' }}
          >
            {'Open Camera / Select Image'}
          </div>
        </label>
      </div>
    </main>
  );
};

export default ImageCapture;
