import React, { useState } from "react";
import { Button, TextField, Typography, IconButton } from "@mui/material";
import { IoIosSend } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { marked } from "marked";
import "./ChatBot.css";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, isBot: false },
    ]);

    setLoading(true);
    setUserMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/chatBot/request",
        {
          question: userMessage,
        }
      );

      const botReply =
        response.data.answer || "I'm sorry, I couldn't process that.";

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botReply, isBot: true },
      ]);
    } catch (error) {
      console.error("Error communicating with the bot:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "There was an issue processing your request. Please try again.",
          isBot: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const formatMessage = (messageText) => {
    return { __html: marked(messageText) };
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbox-tag">
        <Typography variant="h5"> Meowster - Your Pet Assistant 🐱</Typography>
        </div>
        <div className="chatbox-tag-btn">
        <IconButton onClick={onClose} className="chatbox-close-button" disableRipple>
          <IoClose size={30} />
        </IconButton>
        </div>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.isBot ? "bot-message" : "user-message"
            }`}
          >
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={formatMessage(message.text)}
            />
          </div>
        ))}
        {loading && (
          <div className="chat-message bot-message">
            <Typography variant="body2">Typing...</Typography>
          </div>
        )}
      </div>
      <div className="chatbot-input">
        <div className="chatbot-text">
          <TextField
            label="Type your question here"
            variant="outlined"
            fullWidth
            size="small"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
        </div>
        <div className="chatbot-btn">
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!userMessage || loading}
          >
            <IoIosSend size={24} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
