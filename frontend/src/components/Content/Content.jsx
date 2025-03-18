import React from "react";
import "./Content.css";
import ContentHome from "./ContentHome/ContentHome";
import QueryMaker from "./QueryMaker/QueryMaker";
import ScanImage from "./ScanImage/ScanImage";
import EncoderTool from "./EncoderTool/EncoderTool";
import ColorMixer from "./ColorMixer/ColorMixer";
import JSONRepair from "./JSONRepair/JSONRepair";

const Content = ({ isMenu, setIsMenu }) => {
  const menuComponents = {
    1: <QueryMaker isMenu={isMenu} setIsMenu={setIsMenu} />,
    2: <ScanImage isMenu={isMenu} setIsMenu={setIsMenu} />,
    3: <EncoderTool isMenu={isMenu} setIsMenu={setIsMenu} />,
    4: <ColorMixer isMenu={isMenu} setIsMenu={setIsMenu} />,
    5: <JSONRepair isMenu={isMenu} setIsMenu={setIsMenu} />,
  };

  return (
    <div className="content-page">
      {menuComponents[isMenu] || <ContentHome />}
    </div>
  );
};

export default Content;
