import "./App.css";
import React, { useState, useEffect } from "react";
import { Modal } from "./components/Modal/Modal";
import { Timer } from "./components/Timer/Timer";

import { pomo, sb, lb } from "./theme";

import styled, { ThemeProvider } from "styled-components";

import useSound from "use-sound";
import {
  Pomodoro,
  TimerSettingsForm,
} from "./components/TimerSettingsForm/TimerSettingsForm";
import { PomodoroState } from "./model";

const beep = require("./assets/tt.mp3");
const Notification = require("react-web-notification").default;

const DEFAULT_BREAKS = 4;
const DEFAULT_VOLUME = 0.25;

const DEFAULT_SHORT_BREAK_TIME = 5;
const DEFAULT_LONG_BREAK_TIME = 15;
const DEFAULT_POMO_TIME = 25;
// DEBUG
// const DEFAULT_POMO_TIME = 0.1;
// const DEFAULT_SHORT_BREAK_TIME = 0.1;
// const DEFAULT_LONG_BREAK_TIME = 0.1;

const AppContanier = styled.div`
  transition: background-color 0.2s ease-in;
  height: 100vh;
  overflow-y: hidden;
  background-color: ${(props) => props.theme.primary};
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.secondary};
  text-decoration: none;
  border: none;
  padding: 10px 30px;
  font-size: 16px;
  color: #1d3557;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s all;
  text-transform: capitalize;
  &:active {
    transform: scale(0.97);
  }
  &:focus {
    outline: none;
    filter: brightness(0.9);
  }
`;

const noop = () => {};

const NOTIFICATION_OPTIONS = {
  lang: "en",
  dir: "ltr",
  sound: "", // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
};

const getTitleTextFor = (state: PomodoroState) => {
  switch (state) {
    case PomodoroState.POMODORO:
      return "Work! 👷";
    case PomodoroState.SHORT_BREAK:
      return "Take a short break 😎";
    case PomodoroState.LONG_BREAK:
      return "Take a long break 🎉";
  }
};

function App() {
  const [time, setTime] = useState(DEFAULT_POMO_TIME * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [pomoTime, setPomoTime] = useState(DEFAULT_POMO_TIME);
  const [shortBreakTime, setShortBreakTime] = useState(
    DEFAULT_SHORT_BREAK_TIME
  );
  const [numBreaks, setNumBreaks] = useState(DEFAULT_BREAKS);
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK_TIME);
  const [pomoState, setPomoState] = useState(PomodoroState.POMODORO);
  const [breaksUsed, setBreaksUsed] = useState(0);
  const [title, setTitle] = useState(document.title);

  const [notificationsIgnored, setNotificationsIgnored] = useState(true);
  const [notificationTitle, setNotificationTitle] = useState("Time to work");
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [play] = useSound(beep, { volume });

  useEffect(() => {
    if (time === 3) {
      play();
    }

    const title = getTitleTextFor(pomoState);
    // TODO: no any
    let interval: any = null;
    if (time > 0 && active) {
      interval = setInterval(() => {
        const newTime = time - 1;
        setTime(newTime);

        setTitle(
          `${title} ${Math.floor(newTime / 60)}:${
            newTime % 60 < 10 ? `0${newTime % 60}` : newTime % 60
          }`
        );
      }, 1000);
    } else if (time === 0 && active) {
      setNotificationsIgnored(false);
      setNotificationTitle(title);
      if (pomoState === PomodoroState.SHORT_BREAK) {
        setPomoState(PomodoroState.POMODORO);
        setTime(pomoTime * 60);
        setBreaksUsed(breaksUsed + 1);
      } else if (pomoState === PomodoroState.LONG_BREAK) {
        setPomoState(PomodoroState.POMODORO);
        setTime(pomoTime * 60);
      } else if (pomoState === PomodoroState.POMODORO) {
        if (breaksUsed >= numBreaks) {
          setPomoState(PomodoroState.LONG_BREAK);
          setTime(longBreakTime * 60);
          setBreaksUsed(0);
        } else {
          setPomoState(PomodoroState.SHORT_BREAK);
          setTime(shortBreakTime * 60);
        }
      }
    }
    return () => {
      setNotificationsIgnored(true);
      clearInterval(interval);
    };
  }, [
    time,
    active,
    breaksUsed,
    pomoState,
    play,
    shortBreakTime,
    longBreakTime,
    pomoTime,
    numBreaks,
    title,
  ]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  const toggleTimer = () => {
    setActive(!active);
  };

  const handlePermissionDenied = () => {
    setNotificationsIgnored(true);
  };

  const handleShortBreakClicked = () => {
    if (pomoState !== PomodoroState.SHORT_BREAK) {
      setPomoState(PomodoroState.SHORT_BREAK);
      setActive(false);
      setTime(shortBreakTime * 60);
      setBreaksUsed(breaksUsed + 1);
    }
  };

  const handleLongBreakClicked = () => {
    if (pomoState !== PomodoroState.LONG_BREAK) {
      setPomoState(PomodoroState.LONG_BREAK);
      setActive(false);
      setTime(longBreakTime * 60);
      setBreaksUsed(0);
    }
  };

  const handlePomoClicked = () => {
    if (pomoState !== PomodoroState.POMODORO) {
      setPomoState(PomodoroState.POMODORO);
      setActive(false);
      setTime(pomoTime * 60);
    }
  };

  const handleSettingsChange = (pomo: Pomodoro) => {
    const { breaks, shortBreakTime, longBreakTime, pomoTime, volume } = pomo;
    setNumBreaks(breaks);
    setShortBreakTime(shortBreakTime);
    setLongBreakTime(longBreakTime);
    setPomoTime(pomoTime);
    setVolume(volume || DEFAULT_VOLUME);

    if (!active && pomoState === PomodoroState.POMODORO) {
      setTime(pomoTime * 60);
    }
    if (!active && pomoState === PomodoroState.SHORT_BREAK) {
      setTime(shortBreakTime * 60);
    }
    if (!active && pomoState === PomodoroState.LONG_BREAK) {
      setTime(longBreakTime * 60);
    }

    setIsSettingsOpen(false);
  };

  const getTheme = (state: PomodoroState) => {
    if (state === PomodoroState.POMODORO) {
      return pomo;
    } else if (state === PomodoroState.SHORT_BREAK) {
      return sb;
    } else {
      return lb;
    }
  };
  const theme = getTheme(pomoState);

  return (
    <ThemeProvider theme={theme}>
      <AppContanier>
        <nav className="nav">
          <Button onClick={() => setIsSettingsOpen(true)}>settings</Button>
        </nav>
        <div className="main">
          <Timer
            pomoState={pomoState}
            active={active}
            toggleTimer={toggleTimer}
            handlePomoClicked={handlePomoClicked}
            handleLongBreakClicked={handleLongBreakClicked}
            handleShortBreakClicked={handleShortBreakClicked}
            time={time}
          ></Timer>
        </div>
        <Modal
          onClose={() => setIsSettingsOpen(false)}
          title="timer settings"
          open={isSettingsOpen}
        >
          <TimerSettingsForm
            pomodoro={{
              pomoTime: pomoTime,
              shortBreakTime: shortBreakTime,
              longBreakTime: longBreakTime,
              breaks: numBreaks,
              volume,
            }}
            onSubmit={handleSettingsChange}
          />
        </Modal>
        <Notification
          ignore={notificationsIgnored}
          notSupported={handlePermissionDenied}
          onPermissionGranted={noop}
          onPermissionDenied={handlePermissionDenied}
          onShow={noop}
          onClick={noop}
          onClose={noop}
          onError={noop}
          options={NOTIFICATION_OPTIONS}
          timeout={5000}
          title={notificationTitle}
          swRegistration={noop}
        ></Notification>
      </AppContanier>
    </ThemeProvider>
  );
}

export default App;
  