import React from "react";
import "./ColorMixer.css";

const ColorMixer = ({ isMenu, setIsMenu }) => {
  return (
    <div className="content-page">
      <div className="content-header">
        <span className="content-span">
          Color Mixer는 원하는 색상을 조합하여 색상을 추천해주는 도구입니다.
        </span>
        <i
          className="bx bxs-home home"
          onClick={() => {
            setIsMenu("");
          }}
        ></i>
      </div>
      <div className="content-main">ColorMixer</div>
      <div className="content-footer"></div>
    </div>
  );
};

export default ColorMixer;
