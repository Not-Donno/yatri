"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function MechanicDashboard() {
  const activeRequestId = "replace-with-real-request-id";

  useEffect(() => {
    socket.connect();

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit("mechanic-location", {
          requestId: activeRequestId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">
        Mechanic Dashboard Running...
      </h1>
    </div>
  );
}