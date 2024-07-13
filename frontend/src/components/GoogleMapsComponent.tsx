import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

const FitBounds: React.FC<{
  bounds: [LatLngTuple, LatLngTuple];
}> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
};

const LeafletMap: React.FC<{
  ownerCoords: {
    lat?: number;
    lng?: number;
  };
  renterCoords: {
    lat?: number;
    lng?: number;
  };
}> = ({ ownerCoords, renterCoords }) => {
  const source = useMemo(
    () => [renterCoords.lat, renterCoords.lng] as LatLngTuple,
    [renterCoords.lat, renterCoords.lng],
  );
  const destination = useMemo(
    () => [ownerCoords.lat, ownerCoords.lng] as LatLngTuple,
    [ownerCoords.lat, ownerCoords.lng],
  );

  const [route, setRoute] = useState<Array<LatLngTuple>>([]);
  const [travelTime, setTravelTime] = useState<string>("");
  const [bounds, setBounds] = useState<[LatLngTuple, LatLngTuple] | null>(null);

  useEffect(() => {
    if (
      renterCoords.lat !== undefined &&
      renterCoords.lng !== undefined &&
      ownerCoords.lat !== undefined &&
      ownerCoords.lng !== undefined
    ) {
      const fetchDirections = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${source[1]},${source[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`,
          );
          const data = await response.json();
          if (data.routes?.length > 0) {
            const route = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple,
            );
            setRoute(route);

            const duration = data.routes[0].duration; // Duration in seconds
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            setTravelTime(`${hours}h ${minutes}m`);

            const bounds: [LatLngTuple, LatLngTuple] = [
              [source[0], source[1]],
              [destination[0], destination[1]],
            ];
            setBounds(bounds);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchDirections();
    }
  }, [source, destination, renterCoords, ownerCoords]);

  if (
    renterCoords.lat === undefined ||
    renterCoords.lng === undefined ||
    ownerCoords.lat === undefined ||
    ownerCoords.lng === undefined
  ) {
    return <div>Cannot fetch map details.</div>;
  }

  return (
    <div className="text-white">
      {travelTime && (
        <h1 className="my-2 text-xl text-slate-300">
          Estimated Travel Time: {travelTime}
        </h1>
      )}
      <MapContainer
        center={source}
        zoom={8}
        style={{ height: "400px", width: "100%" }}
        className="relative -z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={source}>
          <Popup>Source: San Francisco</Popup>
        </Marker>
        <Marker position={destination}>
          <Popup>Destination: Los Angeles</Popup>
        </Marker>
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        {bounds && <FitBounds bounds={bounds} />}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
