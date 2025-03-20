import React from "react";
import "./SideMenu.css";

const SideMenu = ({ isMenu, setIsMenu }) => {
  return (
    <div className="sidemenu-page">
      <div className="sidemenu-header">
        <span className="sidemenu-span">
          <img className="sidemenu-icon" src="/gpt.svg" alt="GPT Logo" /> GPT
          Utility
        </span>
      </div>
      <div className="sidemenu-main">
        <button
          className={`sidemenu-page-btn ${isMenu === 1 ? "active" : ""}`}
          onClick={() => setIsMenu(1)}
        >
          Query Maker
        </button>
        <button
          className={`sidemenu-page-btn ${isMenu === 2 ? "active" : ""}`}
          onClick={() => setIsMenu(2)}
        >
          Scan Image
        </button>
        <button
          className={`sidemenu-page-btn ${isMenu === 3 ? "active" : ""}`}
          onClick={() => setIsMenu(3)}
        >
          Encoder Tool
        </button>
        <button
          className={`sidemenu-page-btn ${isMenu === 4 ? "active" : ""}`}
          onClick={() => setIsMenu(4)}
        >
          Color Mixer
        </button>
        <button
          className={`sidemenu-page-btn ${isMenu === 5 ? "active" : ""}`}
          onClick={() => setIsMenu(5)}
        >
          JSON Repair
        </button>
      </div>
      <div className="sidemenu-footer">
        <p className="copyright">
          Created by:{" "}
          <a href="mailto:starringname@naver.com">starringname@naver.com</a>
          <br />
          For personal use only. Commercial use is strictly prohibited.
          <br />
          Copyright © 2025. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SideMenu;
