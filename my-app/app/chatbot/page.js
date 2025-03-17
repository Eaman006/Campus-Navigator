"use client"
import { useRef, useState } from "react";
import Image from "next/image";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");  
  const inputRef = useRef(null)

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);


    // Logic to connect with backend (to be done)

    setInput("");
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
            <Image src="/logoSend.png" width={100} height={100} alt='logo' />
            <h2 className="font-bold text-[35px] text-[#000000]">Campus Assistant</h2>
        </div>
        <Image src="/profile.png" width={50} height={50} alt='logo' />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 max-w-[40%] ml-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start" // For backend response
            }`}
          >
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Input & Buttons */}
      <div onClick={handleFocus} className="flex mx-auto mb-[5%] items-center p-2 bg-[rgba(217,217,217,0.5)]  rounded-b-lg w-[80%] h-[100px] rounded-[10px] text-[#212529] cursor-text">
      <Image src="/voice.png" width={50} height={50} alt='logo' className="cursor-pointer"/>

        <input
          ref={inputRef}
          type="text"
          className="flex-1 p-2 outline-none rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <Image src="/send.png" width={50} height={50} alt='logo' className="cursor-pointer" onClick={handleSendMessage}/>
      </div>
    </div>
  );
};

export default Chatbot;
