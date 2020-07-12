import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { Modal } from "./Modal";
import "./App.css";

import useSound from "use-sound";
const beep = require("./assets/tt.mp3");

const DEFAULT_SHORT_BREAK_TIME = 5;
const DEFAULT_LONG_BREAK_TIME = 15;
const DEFAULT_POMO_TIME = 25;
// DEBUG
// const DEFAULT_POMO_TIME = 5;
// const DEFAULT_SHORT_BREAK_TIME = 5;
// const DEFAULT_LONG_BREAK_TIME = 5;
const DEFAULT_BREAKS = 2; // 4 breaks

enum PomodoroState {
  POMODORO = "pomodoro",
  SHORT_BREAK = "short-break",
  LONG_BREAK = "long-break",
}

function App() {
  const [time, setTime] = useState(DEFAULT_POMO_TIME * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [pomoTime, setPomoTime] = useState(DEFAULT_POMO_TIME);
  const [shortBreakTime, setShortBreakTime] = useState(
    DEFAULT_SHORT_BREAK_TIME
  );
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK_TIME);
  const [pomoState, setPomoState] = useState(PomodoroState.POMODORO);
  const [breaks, setBreaks] = useState(0);
  const [play] = useSound(beep);
  // let intervalId = useRef(null)

  useEffect(() => {
    if (time === 3) {
      play();
    }
    let interval: any = null;
    if (time > 0 && active) {
      interval = setInterval(() => setTime(time - 1), 1000);
    } else if (time === 0 && active) {
      if (pomoState === PomodoroState.SHORT_BREAK) {
        if (breaks > DEFAULT_BREAKS) {
          setPomoState(PomodoroState.LONG_BREAK);
          setTime(longBreakTime * 60);
          setBreaks(0);
        } else {
          setPomoState(PomodoroState.POMODORO);
          setTime(pomoTime * 60);
          setBreaks(breaks + 1);
        }
      } else if (pomoState === PomodoroState.LONG_BREAK) {
        setPomoState(PomodoroState.POMODORO);
        setTime(pomoTime * 60);
      } else if (pomoState === PomodoroState.POMODORO) {
        setPomoState(PomodoroState.SHORT_BREAK);
        setTime(shortBreakTime * 60);
      }
    }
    return () => clearInterval(interval);
  }, [
    time,
    active,
    breaks,
    pomoState,
    play,
    shortBreakTime,
    longBreakTime,
    pomoTime,
  ]);

  const toggleTimer = () => {
    setActive(!active);
  };

  const handlePomoTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    if (newTime) {
      setPomoTime(newTime);
      if (!active && pomoState === PomodoroState.POMODORO) {
        setTime(newTime * 60);
      }
    }
  };
  const handleShortBreakTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTime = parseInt(e.target.value);
    if (newTime) {
      setShortBreakTime(newTime);
      if (!active && pomoState === PomodoroState.SHORT_BREAK) {
        setTime(newTime * 60);
      }
    }
  };

  const handleLongBreakTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newTime = parseInt(e.target.value);
    if (newTime) {
      setLongBreakTime(newTime);
      if (!active && pomoState === PomodoroState.LONG_BREAK) {
        setTime(newTime * 60);
      }
    }
  };

  const handleShortBreakClicked = () => {
    if (pomoState !== PomodoroState.SHORT_BREAK) {
      setPomoState(PomodoroState.SHORT_BREAK);
      setActive(false);
      setTime(shortBreakTime * 60);
    }
  };

  const handleLongBreakClicked = () => {
    if (pomoState !== PomodoroState.LONG_BREAK) {
      setPomoState(PomodoroState.LONG_BREAK);
      setActive(false);
      setTime(longBreakTime * 60);
    }
  };

  const handlePomoClicked = () => {
    if (pomoState !== PomodoroState.POMODORO) {
      setPomoState(PomodoroState.POMODORO);
      setActive(false);
      setTime(pomoTime * 60);
    }
  };

  let themeStyle = "";
  if (pomoState === PomodoroState.POMODORO) {
    themeStyle = "pomo";
  } else if (pomoState === PomodoroState.SHORT_BREAK) {
    themeStyle = "sb";
  } else {
    themeStyle = "lb";
  }

  return (
    <div className={`app-container ${themeStyle}`}>
      <nav className="nav">
        <button
          className={`btn ${themeStyle}`}
          onClick={() => setIsSettingsOpen(true)}
        >
          settings
        </button>
      </nav>
      <div className="main">
        <div className={`timer-container ${themeStyle}`}>
          <div className="timer-tabs">
            <button
              className={`${themeStyle} ${
                pomoState === PomodoroState.POMODORO ? "selected" : ""
              }`}
              onClick={handlePomoClicked}
            >
              Pomodoro
            </button>
            <button
              className={`${themeStyle} ${
                pomoState === PomodoroState.SHORT_BREAK ? "selected" : ""
              }`}
              onClick={handleShortBreakClicked}
            >
              Short Break
            </button>
            <button
              className={`${themeStyle} ${
                pomoState === PomodoroState.LONG_BREAK ? "selected" : ""
              }`}
              onClick={handleLongBreakClicked}
            >
              Long Break
            </button>
          </div>
          <p className="timer">
            {Math.floor(time / 60)}
            <span className="colon">:</span>
            {time % 60 < 10 ? `0${time % 60}` : time % 60}
          </p>
          <button className="start" onClick={toggleTimer}>
            {active ? "Stop" : "Start"}
          </button>
        </div>
      </div>
      <CSSTransition
        in={isSettingsOpen}
        timeout={300}
        classNames="modal"
        onEnter={() => setIsSettingsOpen(true)}
        unmountOnExit
        onExit={() => setIsSettingsOpen(false)}
      >
        <Modal
          title="timer settings"
          onClose={() => setIsSettingsOpen(false)}
          onSubmit={() => setIsSettingsOpen(false)}
        >
          <div>
            <label htmlFor="minutes">Pomodoro time (minutes)</label>
            <input
              id="minutes"
              onChange={handlePomoTimeChange}
              type="number"
              value={pomoTime}
            ></input>
          </div>
          <div>
            <label htmlFor="minutes">Short break time (minutes)</label>
            <input
              id="minutes"
              onChange={handleShortBreakTimeChange}
              type="number"
              value={shortBreakTime}
            ></input>
          </div>
          <div>
            <label htmlFor="minutes">Long break time (minutes)</label>
            <input
              id="minutes"
              onChange={handleLongBreakTimeChange}
              type="number"
              value={longBreakTime}
            ></input>
          </div>
        </Modal>
      </CSSTransition>
    </div>
  );
}

export default App;
