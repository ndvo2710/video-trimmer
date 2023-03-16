import "./styles.css";
import "react-video-seek-slider/styles.css";
import { VideoSeekSlider } from "react-video-seek-slider";
import { useCallback, useEffect, useRef, useState } from "react";

export default function App() {
  const player = useRef(null);
  const previewImage = useRef("");
  const interval = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const handleTimeChange = useCallback((time, offsetTime) => {
    if (!player.current?.currentTime) {
      return;
    }

    player.current.currentTime = time / 1000;
    setCurrentTime(time);

    console.log({ time, offsetTime });
  }, []);

  const handlePlay = () => {
    interval.current = setInterval(() => {
      setCurrentTime((player.current?.currentTime || 0) * 1000);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(interval.current);
  };

  const handleDataLoaded = () => {
    setMaxTime((player.current?.duration || 0) * 1000);
  };

  const handleProgress = () => {
    const buffer = player?.current?.buffered;

    if (((buffer?.length > 0 && player.current?.duration) || 0) > 0) {
      let currentBuffer = 0;
      const inSeconds = player.current?.currentTime || 0;

      for (let i = 0; i < buffer.length; i++) {
        if (buffer.start(i) <= inSeconds && inSeconds <= buffer.end(i)) {
          currentBuffer = i;
          break;
        }
      }

      setProgress(buffer.end(currentBuffer) * 1000 || 0);
    }
  };

  const updatePreviewImage = (hoverTime) => {
    const url = `https://via.placeholder.com/140x60?text=${hoverTime}`;
    const image = document.createElement("img");
    image.src = url;

    image.onload = () => {
      previewImage.current = url;
    };
  };

  const handleGettingPreview = useCallback(
    (hoverTime) => {
      // FIND AND RETURN LOADED!!! VIDEO PREVIEW ACCORDING TO the hoverTime TIME
      console.log({ hoverTime, maxTime });
      updatePreviewImage(hoverTime, maxTime);

      return previewImage.current;
    },
    [maxTime]
  );

  useEffect(() => {
    if (!player) {
      return;
    }

    player.current?.addEventListener("play", handlePlay);
    player.current?.addEventListener("pause", handlePause);
    player.current?.addEventListener("loadeddata", handleDataLoaded);
    player.current?.addEventListener("progress", handleProgress);
  }, [player]);

  return (
    <div className="container">
      <h1>React Video slider</h1>

      <VideoSeekSlider
        max={maxTime}
        currentTime={currentTime}
        bufferTime={progress}
        onChange={handleTimeChange}
        limitTimeTooltipBySides={true}
        secondsPrefix="00:"
        minutesPrefix="0:"
        getPreviewScreenUrl={handleGettingPreview}
        timeCodes={[
          {
            fromMs: 0,
            description: "This is a very logn first part label you could use"
          },
          {
            fromMs: 130000,
            description: "This is the second part"
          },
          {
            fromMs: 270000,
            description: "One more part label"
          },
          {
            fromMs: 440000,
            description: "Final battle"
          },
          {
            fromMs: 600000,
            description: "Cast "
          }
        ]}
      />

      <caption>Seeker with time codes and preview opportunity</caption>

      <VideoSeekSlider
        max={maxTime}
        currentTime={currentTime}
        bufferTime={progress}
        onChange={handleTimeChange}
        limitTimeTooltipBySides={true}
        secondsPrefix="00:"
        minutesPrefix="0:"
      />
      <caption>Simple seeker with no timecodes</caption>

      <video
        controls={true}
        autoPlay={true}
        className="video-preview"
        ref={player}
      >
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
