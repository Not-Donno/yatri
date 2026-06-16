"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

type Props = {
  start: [number, number];
  end: [number, number];
};

export default function RouteMachine({
  start,
  end,
}: Props) {
  const map = useMap();

  useEffect(() => {
const routingControl = (L as any).Routing.control({
  waypoints: [
    L.latLng(start[0], start[1]),
    L.latLng(end[0], end[1]),
  ],
  routeWhileDragging: false,
  addWaypoints: false,
  draggableWaypoints: false,
  fitSelectedRoutes: true,
}).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
}