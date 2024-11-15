import React, { useEffect } from "react";

function Map({ location }) {
  useEffect(() => {
    if (location) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 15,
      });
      new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
      });
    }
  }, [location]);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
}

export default Map;
