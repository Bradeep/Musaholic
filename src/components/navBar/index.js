import React from "react";
import "./index.scss";

const NavBar = ({ title }) => {
  return (
    <div className="navWrapper">
      <div className="title-wrapper">
        <div>{title}</div>
      </div>
    </div>
  );
};

export default NavBar;
