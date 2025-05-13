"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 43.31559565826146,
  lng: -73.60379149149044,
};

export const Map = () => {
  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        // options={{ styles: darkMapStyle }}
      >
        <Marker position={center} />
      </GoogleMap>
  );
};
