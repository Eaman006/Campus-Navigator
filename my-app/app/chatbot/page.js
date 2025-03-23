"use client";
import { useRef, useState } from "react";
import Image from "next/image";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    setInput("");
    // Sending request to backend
    try {
      const response = await fetch(
        "https://project-expo-group-90-production.up.railway.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          alert(data.error);
          return;
        }

        const serverMessage = { text: data.response, sender: "server" };
        setMessages((prevMessages) => [...prevMessages, serverMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-white shadow-lg rounded-lg border">
      {/* Header */}
      <div className="bg-[#007BFF] h-[100px] text-white p-4 flex justify-between items-center rounded-t-lg">
        <div className="flex items-center">
          <Image src="/logoSend.png" width={100} height={100} alt="logo" />
          <h2 className="font-bold text-[35px] text-[#000000]">Campus Assistant</h2>
        </div>
        <Image src="/profile.png" width={50} height={50} alt="logo" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-w-[100%] ml-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg w-fit  ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto text-right" // User messages align right
                : "bg-gray-300 text-black mr-auto text-left" // Server messages align left
            }`}
          >
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Input & Buttons */}
      <div
        onClick={handleFocus}
        className="flex mx-auto mb-[5%] items-center p-2 bg-[rgba(217,217,217,0.5)] rounded-b-lg w-[80%] h-[100px] rounded-[10px] text-[#212529] cursor-text"
      >
        <Image
          src="/voice.png"
          width={50}
          height={50}
          alt="logo"
          className="cursor-pointer"
        />

        <input
          ref={inputRef}
          type="text"
          className="flex-1 p-2 outline-none rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <Image
          src="/send.png"
          width={50}
          height={50}
          alt="logo"
          className="cursor-pointer"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chatbot;
