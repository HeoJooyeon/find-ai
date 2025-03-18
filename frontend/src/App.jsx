import React, { useState } from "react";
import Content from "./components/Content/Content";
import SideMenu from "./components/SideMenu/SideMenu";

const App = () => {
  const [isMenu, setIsMenu] = useState("");
  return (
    <div className="container">
      <div className="sidemenu">
        <SideMenu isMenu={isMenu} setIsMenu={setIsMenu} />
      </div>
      <div className="content">
        <Content isMenu={isMenu} setIsMenu={setIsMenu} />
      </div>
    </div>
  );
};

export default App;
