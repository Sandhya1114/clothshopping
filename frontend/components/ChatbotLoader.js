"use client";

import Script from "next/script";

export default function ChatbotLoader() {
  return (
    <Script
      id="northstitch-chatbot"
      src="https://chatbot-v697.onrender.com/chatbot.js?v=20260505-1"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window === "undefined") return;
        if (typeof window.initChatbot !== "function") {
          console.error("initChatbot not available");
          return;
        }

        if (window.__northstitchBot) return;

        window.__northstitchBot = window.initChatbot({
          apiUrl: "https://chatbot-v697.onrender.com",
          appId: "my-app",
          bot: {
            name: "Support Assistant",
          },
        });
      }}
    />
  );
}