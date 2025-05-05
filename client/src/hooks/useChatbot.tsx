import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (text: string) => {
    // Add user message immediately
    const userMessageId = nanoid();
    const userMessage: Message = {
      id: userMessageId,
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to API
      const response = await apiClient.post('/api/chat', { message: text });
      
      // Add bot response
      if (response.botResponse) {
        const botMessage: Message = {
          id: nanoid(),
          text: response.botResponse.message,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error sending message",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      
      // Add error message
      const errorMessage: Message = {
        id: nanoid(),
        text: "Sorry, I couldn't process your request. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Function to clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading
  };
}
