import React, { useState, useEffect } from "react";
import "./QueryMaker.css";

const QueryMaker = ({ isMenu, setIsMenu }) => {
  const [isJsonVisible, setIsJsonVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState(
    "Generate 20 INSERT statements using this table information."
  );
  const [queryData, setQueryData] = useState("");
  const [fields, setFields] = useState({
    tableName: "",
    columns: [
      {
        columnType: "VARCHAR",
        columnLength: 1,
        columnName: "",
        nullable: false,
      },
    ],
  });
  const maxColumn = 10;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedMessages =
      JSON.parse(localStorage.getItem("chatResponse")) || [];
    setMessages(savedMessages);
    const savedFields = JSON.parse(localStorage.getItem("tableFields"));
    if (savedFields) {
      setFields(savedFields);
    }
  }, []);
  useEffect(() => {
    if (fields.tableName) {
      localStorage.setItem("tableFields", JSON.stringify(fields));
    }
  }, [fields]);

  const sendMessage = async () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error(`QueryMaker::Not API Setting apiKey: ${apiKey}`);
      return;
    }
    setLoading(true);
    const requestData = queryData.trim() || JSON.stringify(fields, null, 2);
    console.log("QueryMaker::Sending:", requestData + " " + inputValue);
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
              { role: "system", content: inputValue },
              { role: "user", content: requestData },
            ],
            max_tokens: 3000,
          }),
        }
      );
      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error("QueryMaker::No response data");
      }
      updateMessages(data.choices[0].message.content.trim());
    } catch (error) {
      console.error("QueryMaker::Error fetching response:", error);
      updateMessages("QueryMaker::Response Fail");
    } finally {
      setLoading(false);
    }
  };

  const updateMessages = (responseText) => {
    const newResponse = {
      type: "response",
      text: responseText,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newResponse];
      localStorage.setItem("chatResponse", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    console.log("QueryMaker::Updated response:", responseText);
  };

  const handleChangeTableName = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z0-9_]*$/.test(value) && value.length <= 25) {
      setFields((prevFields) => ({ ...prevFields, tableName: value }));
    }
  };

  const handleChange = (index, field, value) => {
    setFields((prevState) => {
      const newColumns = prevState.columns.map((col, i) => {
        if (i === index) {
          const updatedColumn = { ...col, [field]: value };
          if (field === "columnType") {
            if (value === "INT") {
              updatedColumn.columnLength = 1;
              updatedColumn.nullable = false;
            } else if (value === "DATE") {
              updatedColumn.columnLength = 0;
              updatedColumn.nullable = false;
            } else {
              updatedColumn.columnLength = 1;
            }
          }
          return updatedColumn;
        }
        return col;
      });
      const updatedFields = { ...prevState, columns: newColumns };
      setQueryData(JSON.stringify(updatedFields, null, 2));
      localStorage.setItem("tableFields", JSON.stringify(updatedFields));
      return updatedFields;
    });
  };

  const clearAllMessages = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all messages?"
    );
    if (isConfirmed) {
      localStorage.removeItem("chatResponse");
      setMessages([]);
      console.log("QueryMaker::All messages removed.");
    } else {
      console.log("QueryMaker::Message deletion cancelled.");
    }
  };

  const clearAllPrompt = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all prompt?"
    );
    if (isConfirmed) {
      localStorage.removeItem("tableFields");
      setFields({
        tableName: "",
        columns: [
          {
            columnType: "VARCHAR",
            columnLength: 1,
            columnName: "",
            nullable: false,
          },
        ],
      });
      console.log("QueryMaker::All prompt removed.");
    } else {
      console.log("QueryMaker::Prompt deletion cancelled.");
    }
  };

  const deleteMessage = (index) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((_, i) => i !== index);
      localStorage.setItem("chatResponse", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  return (
    <div className="content-page">
      <div className="content-header">
        <span className="content-span">
          Query Maker는 테이블을 입력하면 INSERT문을 생성해주는 도구입니다.
        </span>
        <i
          className="bx bxs-home home"
          onClick={() => {
            setIsMenu("");
          }}
        ></i>
      </div>

      <div className="content-main">
        <div className="prompt">
          <div className="prompt-title">
            <input
              type="text"
              placeholder="Enter a Table Name"
              value={fields.tableName}
              onChange={handleChangeTableName}
            />
          </div>
          <div className="grid-container header">
            <div>Column Type</div>
            <div>Column Length</div>
            <div>Column Name</div>
            <div>Nullable</div>
            <div>Actions</div>
          </div>
          {fields.columns.map((field, index) => (
            <div key={index} className="grid-container">
              <select
                value={field.columnType}
                onChange={(e) =>
                  handleChange(index, "columnType", e.target.value)
                }
              >
                <option value="VARCHAR">VARCHAR</option>
                <option value="INT">INT</option>
                <option value="DATE">DATE</option>
              </select>
              <input
                type="number"
                value={field.columnLength}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  value = Math.max(1, Math.min(255, value));
                  handleChange(index, "columnLength", value);
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  let pasteValue = e.clipboardData
                    .getData("text")
                    .replace(/\D/g, "");
                  let value = Number(pasteValue);
                  value = Math.max(1, Math.min(255, value));
                  handleChange(index, "columnLength", value);
                }}
                disabled={field.columnType === "DATE"}
              />
              <input
                type="text"
                value={field.columnName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[A-Za-z0-9_]*$/.test(value) && value.length <= 25) {
                    handleChange(index, "columnName", value);
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  let pasteValue = e.clipboardData
                    .getData("text")
                    .replace(/[^A-Za-z0-9_]/g, "")
                    .slice(0, 25);
                  handleChange(index, "columnName", pasteValue);
                }}
                placeholder={`Column Name ${index + 1}`}
              />
              <input
                type="checkbox"
                checked={field.nullable}
                onChange={(e) =>
                  handleChange(index, "nullable", e.target.checked)
                }
                disabled={field.columnType !== "VARCHAR"}
              />
              <i
                className="bx bx-x delete"
                onClick={() => {
                  if (fields.columns.length > 1) {
                    setFields((prev) => {
                      const updatedFields = {
                        ...prev,
                        columns: prev.columns.filter((_, i) => i !== index),
                      };
                      localStorage.setItem(
                        "tableFields",
                        JSON.stringify(updatedFields)
                      );
                      return updatedFields;
                    });
                  } else {
                    alert("At least one column is required.");
                  }
                }}
              ></i>
            </div>
          ))}
          <i
            className="bx bx-plus plus"
            onClick={() => setIsJsonVisible(!isJsonVisible)}
          >
            {isJsonVisible ? "Hide Table JSON Data" : "Show Table JSON Data"}
          </i>
          <i
            className="bx bx-plus plus"
            onClick={() => {
              if (fields.columns.length < maxColumn) {
                setFields((prev) => ({
                  ...prev,
                  columns: [
                    ...prev.columns,
                    {
                      columnType: "VARCHAR",
                      columnLength: 1,
                      columnName: "",
                      nullable: false,
                    },
                  ],
                }));
              } else {
                alert(`Max ${maxColumn} columns allowed.`);
              }
            }}
          >
            Add Column
          </i>
          {isJsonVisible && (
            <textarea
              className="txtarea"
              value={JSON.stringify(fields, null, 2)}
              readOnly
            />
          )}
          <br />
          <i className="bx bx-plus btn" onClick={() => clearAllPrompt()}>
            Clear Prompt
          </i>
          <i className="bx bx-plus btn" onClick={() => clearAllMessages()}>
            Clear Response
          </i>
        </div>
        {messages.map((msg, index) => (
          <div key={index} className="response">
            <textarea className="txtarea" value={msg.text} readOnly />
            <span>
              {msg.date} {msg.timestamp}
              <i
                className="bx bx-x delete"
                onClick={() => deleteMessage(index)}
              ></i>
            </span>
          </div>
        ))}
      </div>

      <div className="content-footer">
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="msg-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <label className="send-table">
            {loading ? <i className="bx bx-loader bx-spin"></i> : "Action"}
            <button className="hidden-input" onClick={sendMessage} />
          </label>
        </form>
      </div>
    </div>
  );
};

export default QueryMaker;
