"use client";

import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "./config";

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;
  private connectionAttempts = 0;
  private maxRetries = 3;
  private isConnecting = false;

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(): Socket | null {
    // Don't attempt connection if already connecting or max retries exceeded
    if (this.isConnecting || this.connectionAttempts >= this.maxRetries) {
      return this.socket;
    }

    if (!this.socket) {
      this.isConnecting = true;
      this.connectionAttempts++;

      try {
        this.socket = io(API_CONFIG.SOCKET_URL, {
          autoConnect: true,
          reconnection: false, // Disable automatic reconnection
          timeout: 5000, // 5 second timeout
          forceNew: true,
        });

        this.socket.on("connect", () => {
          console.log("Socket connected:", this.socket?.id);
          this.connectionAttempts = 0; // Reset on successful connection
          this.isConnecting = false;
        });

        this.socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason);
          this.isConnecting = false;
        });

        this.socket.on("connect_error", (error) => {
          console.warn(
            "Socket connection failed (this is expected in development):",
            error.message
          );
          this.isConnecting = false;

          // Don't retry if we've exceeded max attempts
          if (this.connectionAttempts >= this.maxRetries) {
            console.log(
              "Max socket connection attempts reached. Running in offline mode."
            );
            this.disconnect();
          }
        });

        // Set a timeout to stop trying after 5 seconds
        setTimeout(() => {
          if (this.isConnecting && this.socket && !this.socket.connected) {
            console.log("Socket connection timeout. Running in offline mode.");
            this.disconnect();
          }
        }, 5000);
      } catch (error) {
        console.warn("Failed to initialize socket connection:", error);
        this.isConnecting = false;
        this.socket = null;
      }
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // eslint-disable-next-line
  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.log("Socket not connected. Event not sent:", event);
    }
  }
  // eslint-disable-next-line
  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
  // eslint-disable-next-line
  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketManager = SocketManager.getInstance();
