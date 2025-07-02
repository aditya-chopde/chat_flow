// lib/socket.ts
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:5000"; // <-- use http, not https

let socket: Socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, {
      autoConnect: false,
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disConnectSocket = () => {
  if(socket && socket.disconnect){
    return socket.disconnect();
  }
};

export const getSocket = (): Socket | undefined => socket;
