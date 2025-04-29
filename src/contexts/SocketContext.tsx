// src/contexts/SocketContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"], // Forzar websocket directo
      reconnection: true, // reconexión automática activada
      reconnectionAttempts: 5, // intenta reconectar máximo 5 veces
      reconnectionDelay: 2000, // espera 2 segundos entre intentos
      timeout: 10000, // si no conecta en 10 segundos, considera fallo
    });

    setSocket(newSocket);

    const onConnect = () => {
      console.log("🔌 Conectado al socket:", newSocket.id);
      setIsConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.warn(`⚠️ Socket desconectado: ${reason}`);
      setIsConnected(false);
    };

    const onConnectError = (error: any) => {
      console.error(" Error de conexión:", error.message);
    };

    const onReconnectError = (error: any) => {
      console.error("❌ Error de reconexión:", error.message);
    };

    // Listeners
    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("connect_error", onConnectError);
    newSocket.on("reconnect_error", onReconnectError);

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.off("connect_error", onConnectError);
      newSocket.off("reconnect_error", onReconnectError);
      newSocket.disconnect();
      console.log("🛑 Socket limpiado y desconectado");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
