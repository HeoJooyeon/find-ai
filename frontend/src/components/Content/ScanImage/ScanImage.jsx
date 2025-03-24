import React, { useState, useEffect } from "react";
import "./ScanImage.css";
import { copyToClipboard } from "../../../utils/utils";

const ScanImage = ({ isMenu, setIsMenu }) => {
  const [images, setImages] = useState([]);
  const [inputValue, setInputValue] = useState(
    "Tell me in Korean what's in this image."
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("imageData")) || [];
    setImages(savedImages);
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result;

      const newImage = {
        id: Date.now(),
        src: base64Image,
        name: file.name,
        size: file.size,
        type: file.type,
        isResponse: false,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleTimeString(),
      };

      setImages((prevImages) => {
        const updatedImages = [...prevImages, newImage];
        localStorage.setItem("imageData", JSON.stringify(updatedImages));
        return updatedImages;
      });

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        console.error(`ScanImage::Not API Setting apiKey: ${apiKey}`);
        return;
      }
      setLoading(true);
      console.log("ScanImage::Sending:", inputValue);
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
              model: "gpt-4-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are an assistant who analyzes provided images. If an image contains Chinese characters (Hanzi/Kanji), translate them accurately into English or Korean and provide detailed context and explanation. Begin your response immediately and directly with detailed descriptions or translations. Do NOT use ANY introductory or overview expressions, such as '이 이미지는', '이 이미지에는', '이미지에는', '사진에는', 'In this image', 'The image shows', or any similar phrases. Your response should be descriptive, insightful, context-rich, and at least approximately 300 characters.",
                },
                {
                  role: "user",
                  content: [
                    { type: "text", text: inputValue },
                    {
                      type: "image_url",
                      image_url: {
                        url: base64Image,
                      },
                    },
                  ],
                },
              ],
              max_tokens: 3000,
            }),
          }
        );

        const data = await response.json();
        if (!data.choices || data.choices.length === 0) {
          throw new Error("ScanImage::No response data");
        }
        updateImages(data.choices[0].message.content.trim());
      } catch (error) {
        console.error("ScanImage::Error fetching response:", error);
        updateImages("ScanImage::Response Fail");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateImages = (responseText) => {
    const newResponse = {
      id: Date.now(),
      responseText: responseText,
      isResponse: true,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setImages((prevImages) => {
      const updatedImages = [...prevImages, newResponse];
      localStorage.setItem("imageData", JSON.stringify(updatedImages));
      return updatedImages;
    });

    console.log("ScanImage::Updated response:", responseText);
  };

  const handleDeleteImage = (id) => {
    const updatedImages = images.filter((image) => image.id !== id);
    setImages(updatedImages);
    localStorage.setItem("imageData", JSON.stringify(updatedImages));
  };

  const clearAllImages = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all images?"
    );
    if (isConfirmed) {
      localStorage.removeItem("imageData");
      setImages([]);
      console.log("ScanImage::All images removed.");
    } else {
      console.log("ScanImage::Images deletion cancelled.");
    }
  };

  return (
    <div className="content-page">
      <div className="content-header">
        <span className="content-span">
          Scan Image는 사진을 분석하여 이미지를 설명해주는 도구입니다.
        </span>
        <i className="bx bxs-home home" onClick={() => setIsMenu("")}></i>
      </div>
      <div className="content-main">
        <i className="bx bx-plus clear-btn" onClick={() => clearAllImages()}>
          Clear Images
        </i>
        <div className="image-list">
          {images.map((image) => (
            <div
              key={image.id}
              className={image.isResponse ? "response" : "image-container"}
            >
              {!image.isResponse ? (
                <>
                  <div className="image-info">
                    <span className="prompt-image">
                      <img
                        src={image.src}
                        alt="Uploaded Preview"
                        className="prompt-view"
                      />
                    </span>
                    <span className="prompt-description">
                      <strong>
                        <u>File Name</u> :&nbsp;
                      </strong>
                      {image.name}&nbsp;&nbsp;
                      <strong>
                        <u>File Type</u> :&nbsp;
                      </strong>
                      {image.type}&nbsp;&nbsp;
                      <strong>
                        <u>File Size</u> :&nbsp;
                      </strong>
                      {(image.size / 1024).toFixed(2)} KB
                    </span>
                    <span className="prompt-description">
                      {image.date} {image.timestamp}
                      <i
                        className="bx bx-x delete"
                        onClick={() => handleDeleteImage(image.id)}
                      ></i>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    className="txtarea"
                    value={image.responseText}
                    readOnly
                  />
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(image.responseText)}
                  >
                    Copy
                  </button>
                  <span>
                    {image.date} {image.timestamp}
                    <i
                      className="bx bx-x delete"
                      onClick={() => handleDeleteImage(image.id)}
                    ></i>
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="content-footer">
        <div className="scan-header">
          <input
            type="text"
            className="msg-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <label className="send-table">
            {loading ? <i className="bx bx-loader bx-spin"></i> : "Action"}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files[0];
                if (file && file.size > 5 * 1024 * 1024) {
                  alert(
                    "The file size exceeds 5MB. Please select a different file."
                  );
                  event.target.value = "";
                  return;
                }
                handleImageUpload(event);
              }}
              className="hidden-input"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScanImage;
