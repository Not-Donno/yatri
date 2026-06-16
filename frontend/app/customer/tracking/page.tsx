"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { socket } from "@/lib/socket";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

type Location = {
  latitude: number;
  longitude: number;
};

export default function CustomerTracking() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");

  const [status, setStatus] = useState("PENDING");
  const [mechanicLocation, setMechanicLocation] =
    useState<Location | null>(null);

  useEffect(() => {
    if (!requestId) return;

    socket.connect();

    socket.emit("join-request", requestId);

    // 🔴 LIVE LOCATION
    socket.on("location-update", (data) => {
      setMechanicLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    // 🔵 STATUS UPDATE
    socket.on("status-update", (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.disconnect();
      socket.off("location-update");
      socket.off("status-update");
    };
  }, [requestId]);

  if (!requestId) {
    return (
      <div className="p-6 text-red-500">
        Missing request ID
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">

      {/* STATUS BAR */}
      <div className="p-4 bg-black text-white flex justify-between">
        <div>
          Request ID: <b>{requestId}</b>
        </div>

        <div className="text-blue-400 font-bold">
          {status}
        </div>
      </div>

      {/* MAP */}
      <div className="flex-1">
        <MapContainer
          center={[27.7172, 85.3240]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {mechanicLocation && (
            <Marker
              position={[
                mechanicLocation.latitude,
                mechanicLocation.longitude,
              ]}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}