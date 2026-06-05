"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type MessageType = "info" | "warning" | "alert";

export type Notice = {
  id: string;
  title: string;
  body: string;
  type: MessageType;
  pinned: boolean;
  createdAt: string;
};

type MessagesContextType = {
  notices: Notice[];
  unreadCount: number;
  addNotice: (title: string, body: string, type: MessageType, pinned: boolean) => void;
  deleteNotice: (id: string) => void;
  togglePin: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  isRead: (id: string) => boolean;
};

const MessagesContext = createContext<MessagesContextType | null>(null);

const seed: Notice[] = [
  {
    id: "msg1",
    title: "Tomato supply update",
    body: "Roma tomatoes are short this week due to weather in the Lockyer Valley. We have limited stock — orders will be filled on a first-come basis. Contact us if you need a guaranteed quantity.",
    type: "warning",
    pinned: true,
    createdAt: "2026-06-04T07:00:00",
  },
  {
    id: "msg2",
    title: "New product available — Broccolini",
    body: "We're now stocking fresh Broccolini from our Tweed Shire growers. Available by the bunch or in 5kg cases. Add it to your next order.",
    type: "info",
    pinned: false,
    createdAt: "2026-06-03T09:30:00",
  },
  {
    id: "msg3",
    title: "Public holiday — Monday 9 June",
    body: "The warehouse will be closed on Monday 9 June for the Queen's Birthday public holiday. No deliveries that day. Cut-off for Friday 6 June orders is 12 noon — please order early if you need stock for the weekend.",
    type: "alert",
    pinned: true,
    createdAt: "2026-06-02T08:00:00",
  },
];

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>(seed);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const unreadCount = notices.filter((n) => !readIds.has(n.id)).length;

  function addNotice(title: string, body: string, type: MessageType, pinned: boolean) {
    const notice: Notice = {
      id: `msg${Date.now()}`,
      title,
      body,
      type,
      pinned,
      createdAt: new Date().toISOString(),
    };
    setNotices((prev) => [notice, ...prev]);
  }

  function deleteNotice(id: string) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  function togglePin(id: string) {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  function markAllRead() {
    setReadIds(new Set(notices.map((n) => n.id)));
  }

  function isRead(id: string) {
    return readIds.has(id);
  }

  return (
    <MessagesContext.Provider value={{ notices, unreadCount, addNotice, deleteNotice, togglePin, markRead, markAllRead, isRead }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider");
  return ctx;
}
