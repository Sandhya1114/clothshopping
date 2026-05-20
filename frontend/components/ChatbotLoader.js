"use client";

import Script from "next/script";

export default function ChatbotLoader() {
  const chatbotHost =
    (process.env.NEXT_PUBLIC_CHATBOT_URL || "https://chatbot-v697.onrender.com").replace(
      /\/$/,
      "",
    );
  const chatbotAppId =
    process.env.NEXT_PUBLIC_CHATBOT_APP_ID || "northstitch-clothing-store";

  return (
    <Script
      id="northstitch-chatbot"
      src={`${chatbotHost}/chatbot.js?v=20260505-1`}
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window === "undefined") return;
        if (typeof window.initChatbot !== "function") {
          console.error("initChatbot not available");
          return;
        }

        if (window.__northstitchBot) return;

        window.__northstitchBot = window.initChatbot({
          apiUrl: window.location.origin,
          appId: chatbotAppId,
          bot: {
            name: "NorthStitch Support",
            status: "Online | Products, shipping, returns, and support",
          },
        });
      }}
    />
  );
}
