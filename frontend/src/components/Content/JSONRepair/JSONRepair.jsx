import React, { useState, useEffect } from "react";
import "./JSONRepair.css";

const JSONRepair = ({ isMenu, setIsMenu }) => {
  const [fmtJson, setFmtJson] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedJsons = JSON.parse(localStorage.getItem("jsonData")) || [];
    setFmtJson(savedJsons);
  }, []);

  const sendJson = async (inputValue) => {
    if (!inputValue || inputValue.trim() === "") {
      alert("Please enter a value before sending!");
      return;
    }

    const newJson = {
      id: Date.now(),
      content: inputValue,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
      isResponse: false,
    };

    setFmtJson((prevTexts) => {
      const updatedJsons = [...prevTexts, newJson];
      localStorage.setItem("jsonData", JSON.stringify(updatedJsons));
      return updatedJsons;
    });

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error(`JSONRepair::Not API Setting apiKey: ${apiKey}`);
      return;
    }
    setLoading(true);
    const requestData = inputValue;
    console.log("JSONRepair::Sending:", requestData);
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
              {
                role: "system",
                content: `Please check the provided JSON input and return the result in the following format:
              
              {
                \"after\": { the corrected JSON object, properly fixed and well-formed },
                \"text\": \"A clear explanation in English of what was wrong in the input and how it was corrected. If there was no issue, return: 'The JSON format is correct.'\",
                \"text_ko\": \"A natural Korean translation of the 'text' explanation.\"
              }
              
              Strict Requirements:
              - You MUST compare the original input and the corrected version.
              - If there is **any difference** between the input and 'after', then 'text' and 'text_ko' must explain the exact changes.
              - Do NOT return 'The JSON format is correct.' unless the original input was perfectly valid and no changes were made.
              - Common issues to fix and explain include:
                - Wrong structure (e.g., object used instead of array for 'columns')
                - Missing fields (e.g., missing 'columnType')
                - Unnecessary fields (e.g., 'columnLength' for 'DATE' type)
              
              Translation:
              - 'text_ko' must be a fluent and faithful Korean translation of 'text'.`,
              },
              { role: "user", content: requestData },
            ],
            max_tokens: 3000,
          }),
        }
      );
      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error("JSONRepair::No response data");
      }
      updateJson(data.choices[0].message.content.trim());
    } catch (error) {
      console.error("JSONRepair::Error fetching response:", error);
      updateJson("JSONRepair::Response Fail");
    } finally {
      setLoading(false);
      setInputValue("");
      const textarea = document.querySelector(".msg-input-textarea");
      if (textarea) {
        textarea.setAttribute("rows", "1");
        textarea.style.height = "auto";
      }
    }
  };

  const updateJson = (responseText) => {
    let parsed;
    let isJson = true;

    try {
      parsed =
        typeof responseText === "string"
          ? JSON.parse(responseText)
          : responseText;
    } catch (e) {
      isJson = false;
      console.error("JSONRepair::Failed to parse JSON:", e.message);
    }

    const newResponse = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
      isResponse: true,
      after: isJson ? parsed.after : null,
      text: isJson ? parsed.text : responseText,
      text_ko: isJson ? parsed.text_ko : "",
    };

    if (isJson) {
      console.log("JSONRepair::Parsed JSON Response:", parsed);
    }

    setFmtJson((prevTexts) => {
      const updatedJsons = [...prevTexts, newResponse];
      localStorage.setItem("jsonData", JSON.stringify(updatedJsons));
      return updatedJsons;
    });

    console.log("JSONRepair::Updated response:", responseText);
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const clearAllJsons = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all jsons?"
    );
    if (isConfirmed) {
      localStorage.removeItem("jsonData");
      setFmtJson([]);
      console.log("JSONRepair::All jsons removed.");
    } else {
      console.log("JSONRepair::Jsons deletion cancelled.");
    }
  };

  const handleDeleteJson = (id) => {
    const updatedJsons = fmtJson.filter((fjson) => fjson.id !== id);
    setFmtJson(updatedJsons);
    localStorage.setItem("jsonData", JSON.stringify(updatedJsons));
  };

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
      <div className="content-main">
        <i className="bx bx-plus clear-btn" onClick={() => clearAllJsons()}>
          Clear Jsons
        </i>
        <div className="json-list">
          {fmtJson.map((fjson) => (
            <div
              key={fjson.id}
              className={fjson.isResponse ? "response" : "text-container"}
            >
              {!fjson.isResponse ? (
                <>
                  <div className="text-info">
                    <span className="text-description">
                      <strong>
                        <u>Input Text</u> :&nbsp;
                      </strong>
                      <br />
                      <br />
                      <textarea
                        className="txtarea"
                        value={fjson.content}
                        readOnly
                      />
                    </span>

                    <div className="text-row">
                      <span className="text-description">
                        {fjson.date} {fjson.timestamp}
                        <i
                          className="bx bx-x delete"
                          onClick={() => handleDeleteJson(fjson.id)}
                        ></i>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    className="json-txtarea"
                    value={JSON.stringify(fjson.after, null, 2)}
                    readOnly
                  />

                  <span className="text-description">
                    <strong>
                      <u>Description</u> :&nbsp;
                    </strong>
                    <br />
                    <br />
                    {fjson.text}
                  </span>
                  <span className="text-description">
                    <strong>
                      <u>설명</u> :&nbsp;
                    </strong>
                    <br />
                    <br />
                    {fjson.text_ko}
                  </span>
                  <span>
                    {fjson.date} {fjson.timestamp}
                    <i
                      className="bx bx-x delete"
                      onClick={() => handleDeleteJson(fjson.id)}
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
          <label className="send-table">
            {loading ? <i className="bx bx-loader bx-spin"></i> : "Action"}
            <button
              className="hidden-input"
              onClick={() => sendJson(inputValue)}
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default JSONRepair;
