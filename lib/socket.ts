'use client';

import { io, Socket } from 'socket.io-client';

const socketUrl =
  process.env.NEXT_PUBLIC_NODE_ENV !== 'production'
    ? process.env.NEXT_PUBLIC_API_URL
    : '/';

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
        this.socket = io(socketUrl, {
          autoConnect: true,
          reconnection: false, // Disable automatic reconnection
          timeout: 5000, // 5 second timeout
          forceNew: true,
        });

        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket?.id);
          this.connectionAttempts = 0; // Reset on successful connection
          this.isConnecting = false;
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnectedd:', reason);
          this.isConnecting = false;
        });

        this.socket.on('session:invalidate', () => {
          console.log('Session invalidated due to new login. Reloading...');
          window.location.reload();
          window.location.href = '/login'; // Redirect to login page
          // this.disconnect();
        });

        // this.socket.on("session:invalidate-broadcast", (payload) => {
        //   // Fallback: if user matches, reload
        //   void payload;
        //   window.location.reload();
        // });

        this.socket.on('connect_error', (error) => {
          console.warn(
            'Socket connection failed (this is expected in development):',
            error.message
          );
          this.isConnecting = false;

          // Don't retry if we've exceeded max attempts
          if (this.connectionAttempts >= this.maxRetries) {
            console.log(
              'Max socket connection attempts reached. Running in offline mode.'
            );
            this.disconnect();
          }
        });

        // Set a timeout to stop trying after 5 seconds
        setTimeout(() => {
          if (this.isConnecting && this.socket && !this.socket.connected) {
            console.log('Socket connection timeout. Running in offline mode.');
            this.disconnect();
          }
        }, 5000);
      } catch (error) {
        console.warn('Failed to initialize socket connection:', error);
        this.isConnecting = false;
        this.socket = null;
      }
    }

    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
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

  emit<T>(event: string, data: T): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.log('Socket not connected. Event not sent:', event);
    }
  }

  on<T>(event: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off<T>(event: string, callback?: (data: T) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketManager = SocketManager.getInstance();
