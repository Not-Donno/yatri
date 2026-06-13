"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { socket } from "@/lib/socket";
import { api } from "@/lib/axios";


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

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

  const [customerLocation, setCustomerLocation] =
    useState<Location | null>(null);

  // IMPORTANT: FIXED TYPE HERE
  const center: [number, number] = [27.7172, 85.3240];

  // Load request data
  useEffect(() => {
    if (!requestId) return;

    api.get(`/requests/${requestId}`).then((res) => {
      const data = res.data;

      setStatus(data.status);

      setCustomerLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });
  }, [requestId]);

  // SOCKET LISTENERS
  useEffect(() => {
    if (!requestId) return;

    socket.connect();

    socket.on(`request-${requestId}`, (data) => {
      setStatus(data.status);
    });

    socket.on(`location-${requestId}`, (data) => {
      setMechanicLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [requestId]);

  if (!requestId) {
    return (
      <div className="p-6">
        No tracking ID provided
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      {/* STATUS BAR */}
      <div className="p-3 bg-black text-white">
        Status: {status}
      </div>

      {/* MAP */}
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* CUSTOMER */}
        {customerLocation && (
          <Marker
            position={[
              customerLocation.latitude,
              customerLocation.longitude,
            ]}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* MECHANIC */}
        {mechanicLocation && (
          <Marker
            position={[
              mechanicLocation.latitude,
              mechanicLocation.longitude,
            ]}
          >
            <Popup>Mechanic</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}