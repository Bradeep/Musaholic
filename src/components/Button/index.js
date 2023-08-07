import React from "react";
import "./index.scss";

const Button = ({
  onClick,
  classname,
  buttonColor = "green",
  style,
  children,
}) => {
  return (
    <div
      className={`button-wrapper ${classname}`}
      style={{
        ...style,
        backgroundColor: buttonColor,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Button;
