import React, { useState, useEffect } from "react";
import "./ColorMixer.css";

const ColorMixer = ({ isMenu, setIsMenu }) => {
  const [inputValue, setInputValue] = useState("");
  const [colorTopic, setColorTopic] = useState([]);
  const [mergedTopics, setMergedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [colorFormat, setColorFormat] = useState("hex");

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  useEffect(() => {
    const falseTopics = colorTopic.filter((color) => !color.isResponse);
    const trueTopics = colorTopic.filter((color) => color.isResponse);

    const newMergedTopics = [];
    const minLength = Math.min(
      falseTopics.length,
      Math.floor(trueTopics.length / 5)
    );

    for (let i = 0; i < minLength; i++) {
      newMergedTopics.push(falseTopics[i]);
      newMergedTopics.push(...trueTopics.slice(i * 5, i * 5 + 5));
    }

    setMergedTopics(newMergedTopics);
  }, [colorTopic]);

  useEffect(() => {
    const savedColorTopic = JSON.parse(localStorage.getItem("colorData")) || [];
    setColorTopic(savedColorTopic);
  }, []);

  const handleDeleteById = (targetId) => {
    setColorTopic((prevTopics) => {
      let updatedTopics = [...prevTopics];

      const falseIndex = updatedTopics.findIndex(
        (topic) => topic.id === targetId && !topic.isResponse
      );

      if (falseIndex === -1) {
        alert("The item with the specified ID does not exist.");
        return updatedTopics;
      }

      const trueTopicsToDelete = [];
      for (let i = falseIndex + 1; i < updatedTopics.length; i++) {
        if (updatedTopics[i].isResponse) {
          trueTopicsToDelete.push(i);
          if (trueTopicsToDelete.length === 5) break;
        } else {
          break;
        }
      }

      const indicesToDelete = [falseIndex, ...trueTopicsToDelete];
      updatedTopics = updatedTopics.filter(
        (_, index) => !indicesToDelete.includes(index)
      );

      localStorage.setItem("colorData", JSON.stringify(updatedTopics));

      return updatedTopics;
    });
  };

  const clearAllColors = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all colors?"
    );
    if (isConfirmed) {
      localStorage.removeItem("colorData");
      setMergedTopics([]);
      console.log("ColorMixer::All colors removed.");
    } else {
      console.log("ColorMixer::Colors deletion cancelled.");
    }
  };

  const sendColorTopics = async (inputValue) => {
    if (!inputValue.trim()) {
      alert("Please enter a value before sending!");
      return;
    }

    const newTopics = {
      id: Date.now(),
      content: inputValue,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
      isResponse: false,
    };

    setColorTopic((prevTopics) => {
      const updatedTopics = [...prevTopics, newTopics];
      localStorage.setItem("colorData", JSON.stringify(updatedTopics));
      return updatedTopics;
    });

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("ColorMixer::Not API Setting apiKey");
      return;
    }

    setLoading(true);
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
                content: `You are an AI assistant that generates color combinations based on a given theme. When the user provides a theme, generate exactly five color combinations. Each combination should include a background color and a text color.
              
              The colors should be represented in three formats: HEX, RGB, and a descriptive color name. Ensure that the text color provides sufficient contrast against the background for readability.
              
              The RGB value must be in the format: rgb(R, G, B), for example, rgb(0, 0, 0).
              
              Provide the response in the following JSON format:
              [
                {
                  "bgColor": {
                    "hex": "<HEX Code>",
                    "rgb": "<RGB Value>",
                    "name": "<Color Name>"
                  },
                  "textColor": {
                    "hex": "<HEX Code>",
                    "rgb": "<RGB Value>",
                    "name": "<Color Name>"
                  }
                },
                ...
              ]
              
              Always return exactly five color combinations that match the given theme.`,
              },
              { role: "user", content: inputValue },
            ],
            max_tokens: 3000,
          }),
        }
      );

      const data = await response.json();
      if (!data.choices?.length) {
        throw new Error("ColorMixer::No response data");
      }
      updateColorTopic(data.choices[0].message.content.trim());
    } catch (error) {
      console.error("ColorMixer::Error fetching response:", error);
      updateColorTopic("ColorMixer::Response Fail");
    } finally {
      setLoading(false);
      setInputValue("");
    }
  };

  const updateColorTopic = (colorJson) => {
    if (typeof colorJson === "string") {
      try {
        colorJson = JSON.parse(colorJson);
      } catch (error) {
        console.error("Error parsing colorJson string:", error);
        return;
      }
    }

    if (!Array.isArray(colorJson)) {
      console.error("Error: colorJson is not an array", colorJson);
      return;
    }

    const responseColors = colorJson.map((color, index) => ({
      id: `${Date.now()}-${index}`,
      content: {
        bgColor: { ...color.bgColor },
        textColor: { ...color.textColor },
      },
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
      isResponse: true,
    }));

    setColorTopic((prevTopics) => {
      const updatedColorTopics = [...(prevTopics ?? []), ...responseColors];
      localStorage.setItem("colorData", JSON.stringify(updatedColorTopics));
      return updatedColorTopics;
    });
  };

  return (
    <div className="content-page">
      <div className="content-header">
        <span className="content-span">
          Color Mixer는 주제에 맞는 배경색과 글자색을 추천해주는 도구입니다.
        </span>
        <i className="bx bxs-home home" onClick={() => setIsMenu("")}></i>
      </div>

      <div className="content-main">
        <i className="bx bx-plus clear-btn" onClick={() => clearAllColors()}>
          Clear Colors
        </i>
        <div className="select-wrapper">
          <label>Color Format: </label>
          <select
            value={colorFormat}
            onChange={(e) => setColorFormat(e.target.value)}
          >
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
            <option value="name">Name</option>
          </select>
        </div>

        {mergedTopics.map((color, index) =>
          !color.isResponse ? (
            <div key={color.id || index} className="color-container">
              <span className="text-description">
                <strong>
                  <u>Input Text</u> :&nbsp;
                </strong>
                <br />
                <br />
                {color.content}
              </span>
              <span>
                {color.date} {color.timestamp}
                <i
                  className="bx bx-x delete"
                  onClick={() => handleDeleteById(color.id)}
                ></i>
              </span>
            </div>
          ) : (
            <div
              key={color.id || index}
              className="content-color"
              style={{
                background: color?.content?.bgColor?.[colorFormat] || "#ffffff",
                color: color?.content?.textColor?.[colorFormat] || "#000000",
              }}
            >
              <div className="color-row">
                <span className="color-title">Color Mixer {index % 6}</span>

                <label className="color-label">
                  <span>Background Color</span>
                  <div className="input-group">
                    <textarea
                      value={color?.content?.bgColor?.[colorFormat] || ""}
                      readOnly
                    />
                    <button
                      className="copy-button"
                      onClick={() =>
                        copyToClipboard(color?.content?.bgColor?.[colorFormat])
                      }
                    >
                      Copy
                    </button>
                  </div>
                </label>

                <label className="color-label">
                  <span>Text Color</span>
                  <div className="input-group">
                    <textarea
                      value={color?.content?.textColor?.[colorFormat] || ""}
                      readOnly
                    />
                    <button
                      className="copy-button"
                      onClick={() =>
                        copyToClipboard(
                          color?.content?.textColor?.[colorFormat]
                        )
                      }
                    >
                      Copy
                    </button>
                  </div>
                </label>
              </div>
            </div>
          )
        )}
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
              style={{ resize: "none", overflow: "hidden", height: "1.5em" }}
            />
            <span className="msg-placeholder">Type a message...</span>
          </div>
          <label className="send-table">
            {loading ? <i className="bx bx-loader bx-spin"></i> : "Action"}
            <button
              className="hidden-input"
              onClick={() => sendColorTopics(inputValue)}
            />
          </label>
        </form>
      </div>
    </div>
  );
};

export default ColorMixer;
