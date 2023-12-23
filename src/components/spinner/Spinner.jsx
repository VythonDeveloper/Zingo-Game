import React from "react";
import './spinner.css'

const Spinner = () => {
  return (
    <div className="container spinner-container">
      <div class="spinner-border text-warning" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
  );
};

export default Spinner;
