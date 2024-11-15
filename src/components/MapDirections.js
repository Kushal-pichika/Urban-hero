import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

const MapDirections = ({ currentLocation, taskLocation, googleMapsApiKey }) => {
  const [directions, setDirections] = useState(null);
  const [googleMaps, setGoogleMaps] = useState(null);

  // Set the Google Maps instance when it loads
  const onLoad = (map) => {
    setGoogleMaps(map);
  };

  // Function to get directions to the task location
  const getDirections = () => {
    if (currentLocation && taskLocation && googleMaps) {
      // Check if both locations are the same
      if (currentLocation.lat === taskLocation.latitude && currentLocation.lng === taskLocation.longitude) {
        console.log('Current Location and Task Location are the same.');
        setDirections(null); // No need for directions if locations are the same
        return;
      }

      const DirectionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        destination: new window.google.maps.LatLng(taskLocation.latitude, taskLocation.longitude),
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      console.log('Directions Request:', request); // Log the request to verify coordinates

      DirectionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log('Directions Result:', result); // Log the directions result
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      });
    } else {
      console.error('Invalid locations:', { currentLocation, taskLocation });
    }
  };

  useEffect(() => {
    if (currentLocation && taskLocation) {
      getDirections(); // Get directions when both locations are available
    }
  }, [currentLocation, taskLocation]);

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          id="directions-map"
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={currentLocation || { lat: 0, lng: 0 }} // Default center if no location
          zoom={14}
          onLoad={onLoad}
        >
          {/* Marker for Current Location */}
          {currentLocation && (
            <Marker position={currentLocation} />
          )}

          {/* Marker for Task Location (Only if it's different from Current Location) */}
          {taskLocation && (currentLocation.lat !== taskLocation.latitude || currentLocation.lng !== taskLocation.longitude) && (
            <Marker position={{ lat: taskLocation.latitude, lng: taskLocation.longitude }} />
          )}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapDirections;
