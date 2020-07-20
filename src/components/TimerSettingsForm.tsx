import React, { useState } from "react";

import "./TimerSettings.css";

export interface Pomodoro {
  pomoTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  breaks: number;
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

  return (
    <>
      <div>
        <label htmlFor="pomo-minutes">Pomodoro time (minutes)</label>
        <input
          id="pomo-minutes"
          onChange={handlePomoTimeChange}
          type="number"
          value={pomoTime}
        ></input>
      </div>
      <div>
        <label htmlFor="short-break-minutes">Short break time (minutes)</label>
        <input
          id="short-break-minutes"
          onChange={handleShortBreakTimeChange}
          type="number"
          value={shortBreakTime}
        ></input>
      </div>
      <div>
        <label htmlFor="long-break-minutes">Long break time (minutes)</label>
        <input
          id="long-break-minutes"
          onChange={handleLongBreakTimeChange}
          type="number"
          value={longBreakTime}
        ></input>
      </div>
      <div>
        <label htmlFor="num-breaks">Breaks until long break</label>
        <input
          id="num-minutes"
          onChange={handleBreaksChange}
          type="number"
          value={numBreaks}
        ></input>
      </div>
      <div className="actions">
        <button
          onClick={() =>
            onSubmit({
              breaks: numBreaks,
              shortBreakTime,
              longBreakTime,
              pomoTime,
            })
          }
        >
          Submit
        </button>
      </div>
    </>
  );
};
