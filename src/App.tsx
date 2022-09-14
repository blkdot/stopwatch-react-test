import { useState } from "react";
import "./styles.css";

const formattedSeconds = (sec: number) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);

type LapProps = {
  index: number;
  lap: number;
  onDelete: () => void;
};

const Lap = ({ index, lap, onDelete }: LapProps) => (
  <div key={index} className="stopwatch-lap">
    <strong>{index}</strong>/ {formattedSeconds(lap)}{" "}
    <button onClick={onDelete}> X </button>
  </div>
);

type StopwatchProps = {
  initialSeconds: number;
};

export default function Stopwatch({ initialSeconds }: StopwatchProps) {
  const [incrementer, setIncrementer] = useState<
    ReturnType<typeof setInterval> | undefined
  >();
  const [laps, setLaps] = useState<number[]>([]);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(initialSeconds);
  const [lastClearedIncrementer, setLastClearedIncrementer] = useState<
    ReturnType<typeof setInterval> | undefined
  >();

  const handleStartClick = () => {
    if (incrementer) clearInterval(incrementer);
    let intval: ReturnType<typeof setInterval> | undefined;
    intval = setInterval(() => {
      setSecondsElapsed((secondsElapsed) => secondsElapsed + 1);
    }, 1000);
    setIncrementer(intval);
  };

  const handleStopClick = () => {
    clearInterval(incrementer);
    setLastClearedIncrementer(incrementer);
  };

  const handleResetClick = () => {
    clearInterval(incrementer);
    setLaps([]);
    setSecondsElapsed(0);
  };

  const handleLapClick = () => {
    setLaps([...laps, secondsElapsed]);
  };

  const handleDeleteClick = (index: number) => {
    setLaps([...laps.slice(0, index), ...laps.slice(index + 1, laps.length)]);
  };

  return (
    <div className="stopwatch">
      <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
      {secondsElapsed === 0 || incrementer === lastClearedIncrementer ? (
        <button
          type="button"
          className="start-btn"
          onClick={() => handleStartClick()}
        >
          start
        </button>
      ) : (
        <button
          type="button"
          className="stop-btn"
          onClick={() => handleStopClick()}
        >
          stop
        </button>
      )}
      {secondsElapsed !== 0 && incrementer !== lastClearedIncrementer ? (
        <button type="button" onClick={() => handleLapClick()}>
          lap
        </button>
      ) : null}
      {secondsElapsed !== 0 && incrementer === lastClearedIncrementer ? (
        <button type="button" onClick={() => handleResetClick()}>
          reset
        </button>
      ) : null}
      <div className="stopwatch-laps">
        {laps &&
          laps.map((lap, i) => (
            <Lap
              key={i}
              index={i + 1}
              lap={lap}
              onDelete={() => handleDeleteClick(i)}
            />
          ))}
      </div>
    </div>
  );
}
