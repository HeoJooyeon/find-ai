import React from "react";
import "./JSONRepair.css";

const JSONRepair = ({ isMenu, setIsMenu }) => {
  return (
    <div className="content-page">
      <div className="content-header">
        <span className="content-span">
          JSON Repair는 JSON 구조를 분석하고 오류를 수정해주는 도구입니다.
        </span>
        <i
          className="bx bxs-home home"
          onClick={() => {
            setIsMenu("");
          }}
        ></i>
      </div>
      <div className="content-main">JSONRepair</div>
      <div className="content-footer"></div>
    </div>
  );
};

export default JSONRepair;
