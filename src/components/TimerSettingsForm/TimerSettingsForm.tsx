import React, { useState } from "react";

import "./TimerSettings.css";

export interface Pomodoro {
  pomoTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  breaks: number;
  volume?: number;
}

interface TimerSettingsFormProps {
  pomodoro: Pomodoro;
  onSubmit: (pomdodoro: Pomodoro) => void;
}

export const TimerSettingsForm = (props: TimerSettingsFormProps) => {
  const { pomodoro, onSubmit } = props;
  const [pomoTime, setPomoTime] = useState(pomodoro.pomoTime);
  const [shortBreakTime, setShortBreakTime] = useState(pomodoro.shortBreakTime);
  const [longBreakTime, setLongBreakTime] = useState(pomodoro.longBreakTime);
  const [numBreaks, setNumBreaks] = useState(pomodoro.breaks);
  const [volume, setVolume] = useState(pomodoro.volume || 0.25);

  const handlePomoTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPomoTime(parseInt(e.target.value));
  };

  const handleShortBreakTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShortBreakTime(parseInt(e.target.value));
  };

  const handleLongBreakTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLongBreakTime(parseInt(e.target.value));
  };

  const handleBreaksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumBreaks(parseInt(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <>
      <div className="time-section">
        <div>
          <label htmlFor="pomo-minutes">Pomodoro</label>
          <input
            id="pomo-minutes"
            onChange={handlePomoTimeChange}
            type="number"
            value={pomoTime}
          ></input>
        </div>
        <div>
          <label htmlFor="short-break-minutes">Short break</label>
          <input
            id="short-break-minutes"
            onChange={handleShortBreakTimeChange}
            type="number"
            value={shortBreakTime}
          ></input>
        </div>
        <div>
          <label htmlFor="long-break-minutes">Long break</label>
          <input
            id="long-break-minutes"
            onChange={handleLongBreakTimeChange}
            type="number"
            value={longBreakTime}
          ></input>
        </div>
      </div>
      <hr />
      <div className="breaks">
        <label htmlFor="num-breaks">Breaks until long break</label>
        <input
          id="num-minutes"
          onChange={handleBreaksChange}
          type="number"
          value={numBreaks}
        ></input>
      </div>
      <hr />
      <label htmlFor="volume">Volume</label>
      <input
        id="volume"
        min="0"
        max="1.0"
        onChange={handleVolumeChange}
        step="0.05"
        type="range"
        value={volume}
      ></input>
      <div className="footer">
        <button
          onClick={() =>
            onSubmit({
              breaks: numBreaks,
              shortBreakTime,
              longBreakTime,
              pomoTime,
              volume,
            })
          }
        >
          Submit
        </button>
      </div>
    </>
  );
};
