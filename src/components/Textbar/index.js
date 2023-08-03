import React from "react";

const TextBar = ({ className, placeholder = "Start Guessing..." }) => {
  return (
    <div className={`textbar-wrapper ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          padding: "8px",
          border: "1px solid #999",
          borderRadius: "8px",
          width: "300px",
        }}
      ></input>
    </div>
  );
};

export default TextBar;
