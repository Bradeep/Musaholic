import React from "react";
import "./index.scss";

const Button = ({
  text = "Hi",
  icon,
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
    >
      {children}
    </div>
  );
};

export default Button;
