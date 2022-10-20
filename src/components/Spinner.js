import React from "react";

export default function Spinner() {
 // const widthMain = document.getElementById("goh").clientWidth;
  return (
    <div>
      <span
        className="loader"
        style={{
          display: "block",
          zIndex: "1000",
          position: "absolute",
          left: "50%",
          top: "6px",
        }}
      ></span>
    </div>
  );
}
