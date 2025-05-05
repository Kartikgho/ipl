import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot } from "lucide-react";
import { useChatbot } from "@/hooks/useChatbot";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const PredictionChatbot: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, isLoading } = useChatbot();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden mb-8">
      <CardHeader className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="text-primary-500 h-5 w-5 mr-2" />
          <CardTitle className="font-heading font-semibold">Cricket Analyst Bot</CardTitle>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Online
        </span>
      </CardHeader>
      
      <ScrollArea className="h-80 p-4 bg-neutral-50 flex flex-col space-y-3" ref={scrollAreaRef}>
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="flex items-start max-w-3/4">
            <div className="bg-primary-100 rounded-lg p-3 text-sm">
              <p>Hello! I'm your IPL Cricket Analyst. Ask me anything about match predictions, player stats, or team analysis.</p>
            </div>
          </div>
        )}
        
        {/* Message bubbles */}
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start ${message.isUser ? 'justify-end max-w-3/4 ml-auto' : 'max-w-3/4'}`}
          >
            <div 
              className={`rounded-lg p-3 text-sm ${
                message.isUser 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-primary-100'
              }`}
            >
              <p>{message.text}</p>
              {!message.isUser && message.text.includes("Based on our ML model") && (
                <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                  <li>Recent form in last 3-5 matches</li>
                  <li>Historical performance at the venue</li>
                  <li>Match-up analysis against opposition</li>
                </ul>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start max-w-3/4">
            <div className="bg-primary-100 rounded-lg p-3">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-neutral-200">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Ask about predictions or analysis..."
            className="flex-grow px-3 py-2 border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button 
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-r-md transition-colors"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-neutral-500 px-2">
          Powered by LLM reasoning and ML predictions
        </div>
      </div>
    </Card>
  );
};

export default PredictionChatbot;
