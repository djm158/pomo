import "./App.css";
import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { Modal } from "./Modal";

import { pomo, sb, lb } from "./theme";

import styled, { ThemeProvider } from "styled-components";

import useSound from "use-sound";
const beep = require("./assets/tt.mp3");

const DEFAULT_SHORT_BREAK_TIME = 5;
const DEFAULT_LONG_BREAK_TIME = 15;
const DEFAULT_POMO_TIME = 25;
// DEBUG
// const DEFAULT_POMO_TIME = 0.1;
// const DEFAULT_SHORT_BREAK_TIME = 0.1;
// const DEFAULT_LONG_BREAK_TIME = 0.1;
const DEFAULT_BREAKS = 4;

enum PomodoroState {
  POMODORO = "pomodoro",
  SHORT_BREAK = "short-break",
  LONG_BREAK = "long-break",
}

const AppContanier = styled.div`
  transition: background-color 0.2s ease-in;
  height: 100vh;
  overflow-y: hidden;
  background-color: ${(props) => props.theme.primary};
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  width: 500px;
  height: 320px;
  justify-content: center;
  padding: 1.5rem;
  transition: background-color 0.2s ease-in;
  background-color: ${(props) => props.theme.secondary};
  @media (max-width: 768px) {
    width: 400px;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
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
  outline: none;
  transition: 0.2s all;
  text-transform: capitalize;
  &:active {
    transform: scale(0.97);
  }
`;

interface CustomButtonProps {
  selected: boolean;
}

const StyledTabButton = styled.button<CustomButtonProps>`
  background-color: ${(props) =>
    props.selected ? props.theme.tertiary : "transparent"};
  border: none;
  font-size: 18px;
  border-radius: 4px;
  padding: 0.4rem;
  transition: background-color 0.2s ease-in;

  &:active,
  &:focus {
    outline: none;
    border: none;
  }
  &:hover {
    cursor: pointer;
  }
`;

const TimerTabs = styled.div`
  display: flex;
  width: 75%;
  justify-content: space-evenly;
`;

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
  const [play] = useSound(beep);

  useEffect(() => {
    if (time === 3) {
      play();
    }
    // TODO: no any
    let interval: any = null;
    if (time > 0 && active) {
      interval = setInterval(() => {
        const newTime = time - 1;
        setTime(newTime);
        setTitle(
          `${Math.floor(newTime / 60)}:${
            newTime % 60 < 10 ? `0${newTime % 60}` : newTime % 60
          }`
        );
      }, 1000);
    } else if (time === 0 && active) {
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
    return () => clearInterval(interval);
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

  const handleBreaksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumBreaks(parseInt(e.target.value));
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
          <TimerContainer>
            <TimerTabs>
              <StyledTabButton
                selected={pomoState === PomodoroState.POMODORO}
                onClick={handlePomoClicked}
              >
                Pomodoro
              </StyledTabButton>
              <StyledTabButton
                selected={pomoState === PomodoroState.SHORT_BREAK}
                onClick={handleShortBreakClicked}
              >
                Short Break
              </StyledTabButton>
              <StyledTabButton
                selected={pomoState === PomodoroState.LONG_BREAK}
                onClick={handleLongBreakClicked}
              >
                Long Break
              </StyledTabButton>
            </TimerTabs>
            <p className="timer">
              {Math.floor(time / 60)}
              <span className="colon">:</span>
              {time % 60 < 10 ? `0${time % 60}` : time % 60}
            </p>
            <button className="start" onClick={toggleTimer}>
              {active ? "Stop" : "Start"}
            </button>
          </TimerContainer>
        </div>
        <CSSTransition
          classNames="modal"
          in={isSettingsOpen}
          onEnter={() => setIsSettingsOpen(true)}
          onExit={() => setIsSettingsOpen(false)}
          timeout={300}
          unmountOnExit
        >
          <Modal
            onClose={() => setIsSettingsOpen(false)}
            onSubmit={() => setIsSettingsOpen(false)}
            title="timer settings"
          >
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
              <label htmlFor="short-break-minutes">
                Short break time (minutes)
              </label>
              <input
                id="short-break-minutes"
                onChange={handleShortBreakTimeChange}
                type="number"
                value={shortBreakTime}
              ></input>
            </div>
            <div>
              <label htmlFor="long-break-minutes">
                Long break time (minutes)
              </label>
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
          </Modal>
        </CSSTransition>
      </AppContanier>
    </ThemeProvider>
  );
}

export default App;
