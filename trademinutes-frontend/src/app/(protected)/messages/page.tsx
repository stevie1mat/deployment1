"use client";

import React, { useState, useEffect, useRef } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import { FiSearch, FiPlus, FiPhone, FiVideo, FiMoreHorizontal, FiPaperclip, FiSmile, FiSend } from "react-icons/fi";

interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: string;
  timestamp: number;
  isMe?: boolean;
  typing?: boolean;
}

interface Conversation {
  id: string;
  type: string;
  name: string;
  avatar: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: number;
  updatedAt: number;
}

export default function MessagesPage() {
  const [selectedTab, setSelectedTab] = useState("Inbox");
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  console.log("MessagesPage rendered");

  // Get current user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode JWT to get user info (you might want to store this in context)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({
          id: payload.id,
          name: payload.name || (payload.email ? payload.email.split('@')[0] : undefined),
          email: payload.email
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    if (!currentUser?.email) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_MESSAGING_WS_URL || 'ws://localhost:8085'}/ws?userId=${currentUser.email}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      setTimeout(() => {
        setWs(null);
      }, 5000);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [currentUser?.email]);

  // Fetch conversations
  useEffect(() => {
    console.log("currentUser in messages page:", currentUser);
    if (!currentUser?.email) return;
    const fetchConversations = async () => {
      console.log("Fetching conversations for:", currentUser.email);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MESSAGING_API_URL || 'http://localhost:8085'}/api/conversations?userId=${currentUser.email}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched conversations:", data);
          setConversations(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [currentUser]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConv) return;

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for conversation:", selectedConv);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MESSAGING_API_URL || 'http://localhost:8085'}/api/conversations/${selectedConv}/messages`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched messages:", data);
          // Mark messages as sent by current user
          const messagesWithOwnership = data.map((msg: Message) => ({
            ...msg,
            isMe: msg.senderId === currentUser?.email
          }));
          setMessages(messagesWithOwnership);
        } else {
          console.error("Failed to fetch messages:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConv, currentUser?.email]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-select conversation if redirected from task detail
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const autoSelectId = sessionStorage.getItem("autoSelectConversationId");
      console.log("Auto-select ID:", autoSelectId);
      console.log("All conversations:", conversations);
      if (autoSelectId && conversations.length > 0) {
        const found = conversations.find(c => {
          if (typeof c.id === 'string') return c.id === autoSelectId;
          if (typeof c.id === 'object' && c.id !== null && 'oid' in c.id) return (c.id as any).oid === autoSelectId;
          if (typeof c.id === 'object' && c.id !== null && '$oid' in c.id) return (c.id as any).$oid === autoSelectId;
          return false;
        });
        console.log("Found conversation for auto-select:", found);
        if (found) {
          let convId = '';
          if (typeof found.id === 'string') convId = found.id;
          else if (typeof found.id === 'object' && found.id !== null && 'oid' in found.id) convId = (found.id as any).oid;
          else if (typeof found.id === 'object' && found.id !== null && '$oid' in found.id) convId = (found.id as any).$oid;
          setSelectedConv(convId);
          sessionStorage.removeItem("autoSelectConversationId");
        }
      }
    }
  }, [conversations]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case "message":
        const newMessage = {
          ...data.message,
          isMe: data.message.senderId === currentUser?.email
        };
        setMessages(prev => [...prev, newMessage]);
        
        // Update conversation's last message
        setConversations(prev => 
          prev.map(conv => 
            conv.id === data.message.roomId 
              ? { ...conv, lastMessage: data.message, updatedAt: data.message.timestamp }
              : conv
          )
        );
        // Remove sender from typingUsers when a message is received
        setTypingUsers(prev => prev.filter(user => user !== data.message.senderName));
        break;
      
      case "typing":
        if (data.isTyping) {
          setTypingUsers(prev => prev.includes(data.userName) ? prev : [...prev, data.userName]);
        } else {
          setTypingUsers(prev => prev.filter(user => user !== data.userName));
        }
        break;
      
      case "read":
        // Handle read receipts if needed
        break;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Trying to send:", input, "to", selectedConv, ws, currentUser);
    if (!input.trim() || !selectedConv || !ws || !currentUser) {
      console.log("Send aborted: missing input, selectedConv, ws, or currentUser");
      return;
    }
    const messageData = {
      type: "message",
      roomId: selectedConv,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      content: input
    };
    console.log("Sending messageData via ws:", messageData);
    ws.send(JSON.stringify(messageData));

    // Optimistic UI update
    const optimisticMsg = {
      id: Date.now().toString(), // temporary ID
      roomId: selectedConv,
      senderId: currentUser.email,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      content: input,
      type: "text",
      timestamp: Math.floor(Date.now() / 1000),
      isMe: true
    };
    setMessages(prev => [...prev, optimisticMsg]);

    setInput("");
    setIsTyping(false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    if (!ws || !selectedConv || !currentUser) return;

    // Send typing indicator
    const typingData = {
      type: "typing",
      roomId: selectedConv,
      userName: currentUser.name,
      isTyping: e.target.value.length > 0
    };

    ws.send(JSON.stringify(typingData));
    setIsTyping(e.target.value.length > 0);
  };

  const createNewConversation = async () => {
    if (!currentUser?.id) return;

    const newConversation = {
      type: "direct",
      name: "New Chat",
      avatar: "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
      participants: [currentUser.id]
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MESSAGING_API_URL || 'http://localhost:8085'}/api/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newConversation)
        }
      );

      if (response.ok) {
        const conversationId = await response.text();
        // Refresh conversations
        const convResponse = await fetch(
          `${process.env.NEXT_PUBLIC_MESSAGING_API_URL || 'http://localhost:8085'}/api/conversations?userId=${currentUser.id}`
        );
        if (convResponse.ok) {
          const data = await convResponse.json();
          setConversations(data);
        }
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const selectedConversation = (conversations || []).find(conv => {
    const convId = typeof conv.id === 'string' ? conv.id : 
                  (conv.id && typeof conv.id === 'object' && 'oid' in conv.id) ? (conv.id as any).oid :
                  (conv.id && typeof conv.id === 'object' && '$oid' in conv.id) ? (conv.id as any).$oid :
                  String(conv.id || '');
    return convId === selectedConv;
  });

  return (
    <ProtectedLayout>
      <div className="flex h-[88vh] bg-white rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 min-w-[260px] bg-white border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Search"
                />
              </div>
              <button 
                className="ml-2 p-2 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition"
                onClick={createNewConversation}
              >
                <FiPlus />
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <button
                className={`flex-1 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTab === "Inbox" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-emerald-50"}`}
                onClick={() => setSelectedTab("Inbox")}
              >
                Inbox <span className="ml-1 text-xs bg-white/80 text-emerald-600 px-2 py-0.5 rounded-full">{conversations.length}</span>
              </button>
              <button
                className={`flex-1 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTab === "Explore" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-emerald-50"}`}
                onClick={() => setSelectedTab("Explore")}
              >
                Explore <span className="ml-1 text-xs bg-white/80 text-emerald-600 px-2 py-0.5 rounded-full">0</span>
              </button>
            </div>
            <button className="w-full mt-2 mb-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition text-sm">
              Create New Group
            </button>
            <div className="text-xs text-gray-400 font-semibold mb-2 mt-4">Messages</div>
            <ul className="space-y-1">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => {
                  // Handle both string and ObjectID formats
                  const convId = typeof conv.id === 'string' ? conv.id : 
                                (conv.id && typeof conv.id === 'object' && 'oid' in conv.id) ? (conv.id as any).oid :
                                (conv.id && typeof conv.id === 'object' && '$oid' in conv.id) ? (conv.id as any).$oid :
                                String(conv.id || '');
                  
                  return (
                    <li
                      key={convId}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors group ${selectedConv === convId ? "bg-emerald-100" : "hover:bg-gray-100"}`}
                      onClick={() => setSelectedConv(convId)}
                    >
                    <img
                      src={conv.avatar?.trim() ? conv.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      className="w-9 h-9 rounded-full object-cover border"
                      alt={conv.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate text-gray-900 group-hover:text-emerald-700">{conv.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {conv.lastMessage ? conv.lastMessage.content : "No messages yet"}
                      </div>
                    </div>
                                          <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-gray-400">
                          {conv.lastMessage ? new Date(conv.lastMessage.timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                        </span>
                      </div>
                    </li>
                  );
                })
                )}
            </ul>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col bg-gray-50 min-h-0 h-full">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-8 py-5 bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConversation?.avatar?.trim() ? selectedConversation.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-10 h-10 rounded-full object-cover border"
                    alt={selectedConversation?.name}
                  />
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{selectedConversation.name}</div>
                    <div className="text-xs text-gray-400">{selectedConversation.participants.length} members</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600"><FiPhone /></button>
                  <button className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600"><FiVideo /></button>
                  <button className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600"><FiMoreHorizontal /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4 min-h-0">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-end gap-2 max-w-2xl">
                      {!msg.isMe && (
                        <img
                          src={msg.senderAvatar?.trim() ? msg.senderAvatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          className="w-8 h-8 rounded-full object-cover border"
                          alt={msg.senderName}
                        />
                      )}
                      <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${msg.isMe ? "bg-emerald-100 text-right" : "bg-white border border-gray-100"}`}>
                        {msg.content}
                      </div>
                      {msg.isMe && (
                        <img
                          src={msg.senderAvatar?.trim() ? msg.senderAvatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          className="w-8 h-8 rounded-full object-cover border"
                          alt={msg.senderName}
                        />
                      )}
                    </div>
                  </div>
                ))}
                
            
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2 max-w-2xl">
                      <img
                        src={selectedConversation?.avatar?.trim() ? selectedConversation.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        className="w-8 h-8 rounded-full object-cover border"
                        alt="Typing"
                      />
                      <div className="px-4 py-2 rounded-2xl shadow-sm text-sm bg-white border border-gray-100 italic text-gray-500">
                        {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input box */}
              <form className="flex items-center gap-2 px-8 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10" onSubmit={handleSend}>
                <button type="button" className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600"><FiPaperclip /></button>
                <input
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => { handleTyping(e); console.log('Input changed:', e.target.value); }}
                />
                <button type="button" className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600"><FiSmile /></button>
                <button className="bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-emerald-600 transition flex items-center gap-2" type="submit">
                  <FiSend />
                  <span className="hidden md:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">Select a conversation to start messaging</div>
                <div className="text-gray-300 text-sm">Choose from the conversations on the left</div>
              </div>
            </div>
          )}
        </main>

        {/* Right sidebar: Group Info */}
        {selectedConversation && (
          <aside className="w-1/4 min-w-[260px] bg-white border-l border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedConversation?.avatar?.trim() ? selectedConversation.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="w-12 h-12 rounded-full object-cover border"
                  alt={selectedConversation?.name}
                />
                <div>
                  <div className="font-semibold text-lg text-gray-900">{selectedConversation.name}</div>
                  <div className="text-xs text-gray-400">{selectedConversation.participants.length} members</div>
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <button className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs">Notification</button>
                <button className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs">Pin Group</button>
                <button className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs">Member</button>
                <button className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs">Setting</button>
              </div>
              <div className="text-xs text-gray-400 font-semibold mb-2">Members</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedConversation.participants.slice(0, 3).map((participant, index) => (
                  <img
                    key={index}
                    src={participant && participant.includes('http') ? participant : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-8 h-8 rounded-full object-cover border"
                    alt="Member"
                  />
                ))}
                {selectedConversation.participants.length > 3 && (
                  <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    +{selectedConversation.participants.length - 3}
                  </span>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </ProtectedLayout>
  );
} 