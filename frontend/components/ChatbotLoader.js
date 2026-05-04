"use client";

import Script from "next/script";

const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || "https://chatbot-v697.onrender.com";

export default function ChatbotLoader() {
  return (
    <Script
      src={`${CHATBOT_URL}/chatbot.js`}
      strategy="afterInteractive"
      data-app="my-app"
      onLoad={() => {
        if (typeof window !== "undefined" && typeof window.initChatbot === "function") {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

          window.initChatbot({
            apiUrl: CHATBOT_URL,
            appId: "my-app",
            bot: { name: "Support Assistant" },

            autoCrawl: true,
            autoCrawlUrls: [
              siteUrl,
            ],
            autoCrawlMode: "append",
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
