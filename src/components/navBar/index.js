import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import Calendar from "../../assets/calendar.svg";
import QuestionMark from "../../assets/question.svg";

import Modal from "../Modal";

import "react-datepicker/dist/react-datepicker.css";

import "./index.scss";

const NavBar = ({ title, onDateSelect }) => {
  const CalendarInput = forwardRef(({ value, onClick }, ref) => (
    <img
      src={Calendar}
      height={28}
      width={28}
      style={{ cursor: "pointer" }}
      alt="play"
      onClick={onClick}
      ref={ref}
    />
  ));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);

  const onChangeDate = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const onModalClose = () => {
    setIsInstructionOpen(false);
  };

  const onClickInfo = () => {
    setIsInstructionOpen(true);
  };
  return (
    <div className="navWrapper">
      <div className="title-wrapper">
        <div>{title}</div>
      </div>
      <div className="icons-wrapper">
        <img
          src={QuestionMark}
          alt="question"
          height={28}
          width={28}
          style={{ cursor: "pointer" }}
          onClick={onClickInfo}
        />
        <div>
          <DatePicker
            selected={selectedDate}
            dateFormat="dd/MM/yyyy"
            filterDate={(e) => e < new Date() && e > new Date("2022-07-03")}
            onChange={(date) => onChangeDate(date)}
            customInput={<CalendarInput />}
          />
        </div>
      </div>
      <Modal
        header={"Instructions"}
        open={isInstructionOpen}
        onClose={onModalClose}
        modalCustomClass="nav-modal_class"
        headerCustomId="nav-modal--title"
      >
        <div>
          1. Play the audio for 3 seconds and guess the song from suggestion.
        </div>
        <div>2. If guessed wrongly , audio will be increased by 3 seconds.</div>
        <div>3. Complete guessing within 4 choices and share your score.</div>
      </Modal>
    </div>
  );
};

export default NavBar;
