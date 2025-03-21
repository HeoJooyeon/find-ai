import React, { useState, useEffect } from "react";
import "./EncoderTool.css";

const EncoderTool = ({ isMenu, setIsMenu }) => {
  const [fmtText, setFmtText] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("url-encoder");
  const [instructionText, setInstructionText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTexts = JSON.parse(localStorage.getItem("encoderData")) || [];
    setFmtText(savedTexts);
  }, []);
  useEffect(() => {
    const infoText = {
      "url-encoder": "Encode this text into URL format.",
      "url-decoder": "Decode this text from URL format.",
      "base64-encoder": "Encode this text in Base64 format.",
      "base64-decoder": "Decode this text from Base64 format.",
    };
    setInstructionText(infoText[selectedOption]);
  }, [selectedOption]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const sendEncDec = async (inputValue) => {
    if (!inputValue || inputValue.trim() === "") {
      alert("Please enter a value before sending!");
      return;
    }

    const newText = {
      id: Date.now(),
      content: inputValue,
      type: selectedOption,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
      isResponse: false,
    };

    setFmtText((prevTexts) => {
      const updatedTexts = [...prevTexts, newText];
      localStorage.setItem("encoderData", JSON.stringify(updatedTexts));
      return updatedTexts;
    });

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error(`EncoderTool::Not API Setting apiKey: ${apiKey}`);
      return;
    }
    setLoading(true);
    const requestData = inputValue;
    console.log("EncoderTool::Sending:", requestData + ":" + instructionText);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: instructionText },
              { role: "user", content: requestData },
            ],
            max_tokens: 3000,
          }),
        }
      );
      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error("EncoderTool::No response data");
      }
      updateEncDec(data.choices[0].message.content.trim());
    } catch (error) {
      console.error("EncoderTool::Error fetching response:", error);
      updateEncDec("EncoderTool::Response Fail");
    } finally {
      setLoading(false);
      setInputValue("");
    }
  };

  const updateEncDec = (responseText) => {
    const newResponse = {
      id: Date.now(),
      content: responseText,
      type: selectedOption,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
      isResponse: true,
    };

    setFmtText((prevTexts) => {
      const updatedTexts = [...prevTexts, newResponse];
      localStorage.setItem("encoderData", JSON.stringify(updatedTexts));
      return updatedTexts;
    });
    console.log("EncoderTool::Updated response:", responseText);
  };

  const handleDeleteText = (id) => {
    const updatedTexts = fmtText.filter((ftxt) => ftxt.id !== id);
    setFmtText(updatedTexts);
    localStorage.setItem("encoderData", JSON.stringify(updatedTexts));
  };

  const clearAllTexts = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all texts?"
    );
    if (isConfirmed) {
      localStorage.removeItem("encoderData");
      setFmtText([]);
      console.log("EncoderTool::All texts removed.");
    } else {
      console.log("EncoderTool::Texts deletion cancelled.");
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="content-page">
      <div className="content-header">
        <span className="content-span">
          Encoder Tool은 URL 및 Base64 값을 인코딩하는 도구입니다.
        </span>
        <i
          className="bx bxs-home home"
          onClick={() => {
            setIsMenu("");
          }}
        ></i>
      </div>
      <div className="content-main">
        <i className="bx bx-plus clear-btn" onClick={() => clearAllTexts()}>
          Clear Texts
        </i>
        <div className="text-list">
          {fmtText.map((ftxt) => (
            <div
              key={ftxt.id}
              className={ftxt.isResponse ? "response" : "text-container"}
            >
              {!ftxt.isResponse ? (
                <>
                  <div className="text-info">
                    <span className="text-description">
                      <strong>
                        <u>Input Text</u> :&nbsp;
                      </strong>
                      <br />
                      <br />
                      {ftxt.content}
                    </span>
                    <span className="text-description">
                      <strong>
                        <u>Requested Type</u> :&nbsp;
                      </strong>
                      {ftxt.type}
                    </span>
                    <div className="text-row">
                      <span className="text-description">
                        {ftxt.date} {ftxt.timestamp}
                        <i
                          className="bx bx-x delete"
                          onClick={() => handleDeleteText(ftxt.id)}
                        ></i>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <textarea className="txtarea" value={ftxt.content} readOnly />
                  <span>
                    {ftxt.date} {ftxt.timestamp}
                    <i
                      className="bx bx-x delete"
                      onClick={() => handleDeleteText(ftxt.id)}
                    ></i>
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="content-footer">
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <div className="msg-input-wrapper">
            <textarea
              className="msg-input-textarea"
              placeholder=" "
              value={inputValue}
              onChange={handleInput}
              rows={1}
            />
            <span className="msg-placeholder">Type a message...</span>{" "}
          </div>
          <select
            id="encoderDecoder"
            value={selectedOption}
            onChange={handleChange}
            className="custom-select"
          >
            <option value="url-encoder">URL Encoder</option>
            <option value="url-decoder">URL Decoder</option>
            <option value="base64-encoder">Base64 Encoder</option>
            <option value="base64-decoder">Base64 Decoder</option>
          </select>
          <label className="send-table">
            {loading ? <i className="bx bx-loader bx-spin"></i> : "Action"}
            <button
              className="hidden-input"
              onClick={() => sendEncDec(inputValue)}
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default EncoderTool;
