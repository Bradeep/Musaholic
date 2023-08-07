import React from "react";

import "./index.scss";

const Loader = ({ className }) => {
  return (
    <div class={`loader ${className}`}>
      <svg class="circular-loader" viewBox="25 25 50 50">
        <circle class="loader-path" cx="50" cy="50" r="20"></circle>
      </svg>
    </div>
  );
};

export default Loader;
