import * as React from "react";
import styled from "styled-components";

import { PomodoroState } from "../../model";

interface CustomButtonProps {
  selected: boolean;
}

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

const StyledTabButton = styled.button<CustomButtonProps>`
  background-color: ${(props) =>
    props.selected ? props.theme.tertiary : "transparent"};
  border: none;
  font-size: 18px;
  border-radius: 4px;
  padding: 0.4rem;
  transition: background-color 0.2s ease-in;

  &:focus {
    outline: none;
    filter: brightness(0.9);
  }
  &:hover {
    cursor: pointer;
  }
`;

const TimerTabs = styled.div`
  display: flex;
  width: 75%;
  justify-content: space-evenly;

  @media (max-width: 400px) {
    width: 100%;
  }
`;

interface TimerProps {
  pomoState: PomodoroState;
  time: number;
  handlePomoClicked: () => void;
  handleLongBreakClicked: () => void;
  handleShortBreakClicked: () => void;
  active: boolean;
  toggleTimer: () => void;
}

export const Timer = (props: TimerProps) => {
  const {
    active,
    pomoState,
    time,
    handleLongBreakClicked,
    handleShortBreakClicked,
    handlePomoClicked,
    toggleTimer,
  } = props;
  return (
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
  );
};
