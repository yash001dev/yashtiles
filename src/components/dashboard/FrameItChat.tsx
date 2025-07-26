"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CloseIcon from "@/assets/CloseIcon";

interface FrameItChatProps {
  onClose: () => void;
}

const FrameItChat: React.FC<FrameItChatProps> = ({ onClose }) => {
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; type: "user" | "bot"; message: string; timestamp: Date }>
  >([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("process") || (message.includes("how") && message.includes("work"))) {
      return "Our framing process is super simple! 📋\n\n1. **Plan** - Arrange your photos and spacing\n2. **Clean** - Wipe the wall surface clean\n3. **Peel** - Remove the adhesive backing\n4. **Stick** - Press firmly to attach\n\nNo tools needed!";
    }

    if (message.includes("size") || message.includes("dimensions")) {
      return "Frame sizes: 📏\n\n• **8×10**\n• **11×14**\n• **16×20**\n• **24×36**\n\nWhat size are you framing?";
    }

    if (message.includes("shipping") || message.includes("delivery")) {
      return "🚚 Shipping Options:\n\n• Standard (7–10 days): Free over $50\n• Express (3–5 days): $9.99\n• Rush (1–2 days): $19.99\n\nAll with tracking and returns.";
    }

    if (message.includes("preview")) {
      return "👁️ Yes! You can preview your frame live in our editor. Try different styles, sizes, and layouts before ordering!";
    }

    if (message.includes("hello") || message.includes("hi")) {
      return "Hi there! 👋 I’m " + process.env.NEXT_PUBLIC_APP_NAME + "'s AI assistant. Ask me anything about our frames, pricing, delivery, or setup.";
    }

    return "I'm here to help! Ask me about:\n• Frame styles\n• Sizing options\n• Pricing & shipping\n• Installation help";
  };

  const sendMessage = (message: string, isQuick = false) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      message: message.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot" as const,
        message: generateAIResponse(message),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, isQuick ? 800 : 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(userInput);
    }
  };

  const resetChat = () => {
    setChatMessages([]);
    setUserInput("");
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end justify-end p-4">
      <div className="bg-background rounded-2xl w-96 h-[600px] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">AI</span>
            </div>
            <div>
              <h3 className="font-semibold">{process.env.NEXT_PUBLIC_APP_NAME} Support</h3>
              <p className="text-xs text-muted-foreground">We’re here to help!</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
           <CloseIcon/>
          </Button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {chatMessages.length === 0 && (
            <>
              <div className="text-sm text-muted-foreground">Hi 👋! Ask me about frames, delivery, or installation!</div>
              <div className="space-y-2">
                {[
                  "How does the framing process work?",
                  "What frame sizes do you offer?",
                  "How much does shipping cost?",
                  "Can I see a preview before ordering?",
                ].map((q) => (
                  <Button key={q} variant="outline" className="w-full justify-start" onClick={() => sendMessage(q, true)}>
                    {q}
                  </Button>
                ))}
              </div>
            </>
          )}

          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg max-w-[75%] text-sm whitespace-pre-line ${
                  msg.type === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none"
                }`}
              >
                {msg.message}
                <div className="text-xs mt-1 opacity-70 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
            />
            <Button onClick={() => sendMessage(userInput)} disabled={!userInput.trim() || isTyping}>
              Send
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>AI Assistant</span>
            {chatMessages.length > 0 && (
              <button onClick={resetChat} className="hover:underline text-muted-foreground">
                🔄 Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameItChat;
