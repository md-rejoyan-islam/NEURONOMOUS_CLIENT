"use client";

import { socketManager } from "@/lib/socket";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize socket connection when app starts (optional)
    console.log("Initializing socket connection...");
    const socket = socketManager.connect();

    if (socket) {
      console.log("Socket manager initialized");
    } else {
      console.log("Running without socket connection (offline mode)");
    }

    return () => {
      // Cleanup socket connection when app unmounts
      console.log("Cleaning up socket connection");
      socketManager.disconnect();
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
