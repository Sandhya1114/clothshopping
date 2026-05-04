"use client";

import Script from "next/script";

export default function ChatbotLoader() {
  return (
    <Script
      src="https://chatbot-v697.onrender.com/chatbot.js"
      strategy="afterInteractive"
      data-app="my-app"
      onLoad={() => {
        if (typeof window !== "undefined" && typeof window.initChatbot === "function") {
          window.initChatbot({
            apiUrl: 'https://chatbot-v697.onrender.com',
            appId: 'my-app',
            bot: { name: 'Support Assistant' },

            autoCrawl: true,
            autoCrawlUrls: [
              'http://localhost:3000',
            ],
            autoCrawlMode: 'append',
            autoCrawlSaveToDb: true,
            autoCrawlTTLHours: 24,
            autoCrawlDeepLinks: false,
            autoCrawlMaxPages: 10,
            autoCrawlOnlyFAQPaths: false,
            autoCrawlSilent: true,
          });
        } else {
          console.error("initChatbot not available");
        }
      }}
    />
  );
}