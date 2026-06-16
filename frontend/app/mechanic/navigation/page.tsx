"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import RouteMachine from "@/components/map/RouteMachine";

type Location = {
  latitude: number;
  longitude: number;
};

function SetView({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);

  return null;
}

export default function NavigationPage() {
  const [mechanicLocation, setMechanicLocation] =
    useState<Location | null>(null);

  // Temporary customer location
  // Later this should come from backend/request data
  const customerLocation: Location = {
    latitude: 27.7172,
    longitude: 85.324,
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setMechanicLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (!mechanicLocation) {
    return (
      <div className="flex items-center justify-center h-screen">
        Getting your location...
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        zoom={13}
        className="h-full w-full"
      >
        {/* Keep map centered on mechanic */}
        <SetView
          lat={mechanicLocation.latitude}
          lng={mechanicLocation.longitude}
        />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Mechanic marker */}
        <Marker
          position={[
            mechanicLocation.latitude,
            mechanicLocation.longitude,
          ]}
        >
          <Popup>You (Mechanic)</Popup>
        </Marker>

        {/* Customer marker */}
        <Marker
          position={[
            customerLocation.latitude,
            customerLocation.longitude,
          ]}
        >
          <Popup>Customer</Popup>
        </Marker>

        {/* Route */}
        <RouteMachine
          start={[
            mechanicLocation.latitude,
            mechanicLocation.longitude,
          ]}
          end={[
            customerLocation.latitude,
            customerLocation.longitude,
          ]}
        />
      </MapContainer>
    </div>
  );
}