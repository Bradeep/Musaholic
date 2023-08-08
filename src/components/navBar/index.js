import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import Calendar from "../../assets/calendar.svg";

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

  const onChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };
  return (
    <div className="navWrapper">
      <div className="title-wrapper">
        <div>{title}</div>
      </div>
      <div>
        <DatePicker
          selected={selectedDate}
          dateFormat="dd/MM/yyyy"
          filterDate={(e) => e < new Date() && e > new Date("2022-07-03")}
          onChange={(date) => onChange(date)}
          customInput={<CalendarInput />}
        />
      </div>
    </div>
  );
};

export default NavBar;
