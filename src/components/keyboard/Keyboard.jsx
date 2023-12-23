import React, { useState } from "react";
import "./keyboard.css";

const Keyboard = ({ amount, setAmount, color, title, func }) => {
  const handleNumberClick = (number) => {
    setAmount(amount + number);
  };

  const handleDeleteClick = () => {
    if (amount.length > 0) {
      setAmount(amount.slice(0, -1));
    }
  };

  return (
    <div className="keyboard-container">
      <div
        onClick={() => handleNumberClick(1)}
        className="number user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>1</span>
      </div>

      <div
        onClick={() => handleNumberClick(2)}
        className="number mx-auto user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>2</span>
      </div>

      <div
        onClick={() => handleNumberClick(3)}
        className="number ms-auto user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>3</span>
      </div>

      <div
        onClick={() => handleNumberClick(4)}
        className="number user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>4</span>
      </div>

      <div
        onClick={() => handleNumberClick(5)}
        className="number mx-auto user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>5</span>
      </div>

      <div
        onClick={() => handleNumberClick(6)}
        className="number ms-auto user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>6</span>
      </div>

      <div
        onClick={() => handleNumberClick(7)}
        className="number user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>7</span>
      </div>

      <div
        onClick={() => handleNumberClick(8)}
        className="number mx-auto user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>8</span>
      </div>

      <div
        onClick={() => handleNumberClick(9)}
        className="number ms-auto user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>9</span>
      </div>

      <div className="d-flex align-items-center">
        {title ? (
          <button
            className="btn btn-primary h-75 w-100"
            style={{ backgroundColor: "rgb(252, 148, 13)" }}
            onClick={func}
          >
            {title}
          </button>
        ) : (
          ""
        )}
      </div>

      <div
        onClick={() => handleNumberClick(0)}
        className="number mx-auto user-select-none"
        style={{ backgroundColor: color }}
      >
        <span>0</span>
      </div>

      <div className="delete ms-4">
        <span onClick={() => handleDeleteClick()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M27 5.00006H8.56626C8.22115 5.00154 7.8822 5.09162 7.5819 5.26169C7.2816 5.43176 7.03002 5.67611 6.85126 5.97131L1.1425 15.4851C1.04906 15.6406 0.999695 15.8186 0.999695 16.0001C0.999695 16.1815 1.04906 16.3595 1.1425 16.5151L6.85126 26.0288C7.02993 26.3241 7.28149 26.5685 7.58181 26.7386C7.88213 26.9087 8.22112 26.9987 8.56626 27.0001H27C27.5304 27.0001 28.0391 26.7893 28.4142 26.4143C28.7893 26.0392 29 25.5305 29 25.0001V7.00006C29 6.46963 28.7893 5.96092 28.4142 5.58585C28.0391 5.21077 27.5304 5.00006 27 5.00006ZM20.7075 18.2926C20.8004 18.3855 20.8741 18.4958 20.9244 18.6172C20.9747 18.7386 21.0006 18.8687 21.0006 19.0001C21.0006 19.1315 20.9747 19.2616 20.9244 19.383C20.8741 19.5044 20.8004 19.6147 20.7075 19.7076C20.6146 19.8005 20.5043 19.8742 20.3829 19.9245C20.2615 19.9747 20.1314 20.0006 20 20.0006C19.8686 20.0006 19.7385 19.9747 19.6171 19.9245C19.4957 19.8742 19.3854 19.8005 19.2925 19.7076L17 17.4138L14.7063 19.7076C14.5186 19.895 14.2642 20.0003 13.9989 20.0002C13.7337 20.0001 13.4794 19.8946 13.2919 19.7069C13.1044 19.5193 12.9992 19.2649 12.9993 18.9996C12.9994 18.7344 13.1049 18.48 13.2925 18.2926L15.5863 16.0001L13.2925 13.7076C13.1049 13.5201 12.9994 13.2657 12.9993 13.0005C12.9992 12.8692 13.025 12.7391 13.0752 12.6177C13.1254 12.4964 13.1991 12.3861 13.2919 12.2932C13.3847 12.2003 13.4949 12.1266 13.6162 12.0762C13.7376 12.0259 13.8676 12 13.9989 11.9999C14.2642 11.9998 14.5186 12.1051 14.7063 12.2926L17 14.5863L19.2925 12.2926C19.3854 12.1997 19.4957 12.1259 19.6171 12.0757C19.7385 12.0254 19.8686 11.9995 20 11.9995C20.1314 11.9995 20.2615 12.0254 20.3829 12.0757C20.5043 12.1259 20.6146 12.1997 20.7075 12.2926C20.8004 12.3855 20.8741 12.4958 20.9244 12.6172C20.9747 12.7386 21.0006 12.8687 21.0006 13.0001C21.0006 13.1315 20.9747 13.2616 20.9244 13.383C20.8741 13.5044 20.8004 13.6147 20.7075 13.7076L18.4138 16.0001L20.7075 18.2926Z"
              fill="#A1A1A1"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Keyboard;
