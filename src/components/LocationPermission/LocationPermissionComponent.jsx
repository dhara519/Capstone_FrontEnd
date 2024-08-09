import { useEffect } from "react";
import PropTypes from "prop-types";

const LocationPermissionComponent = ({ setLocation }) => {
  useEffect(() => {
    const getLocation = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permissionStatus.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const currentLocation = `${latitude},${longitude}`;
              setLocation(currentLocation);
            },
            (err) => {
              console.error("Error getting location", err);
              setLocation("San Francisco, CA"); // Fallback location
            }
          );
        } else if (permissionStatus.state === "prompt") {
          // Handle the case where the permission is prompt
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const currentLocation = `${latitude},${longitude}`;
              setLocation(currentLocation);
            },
            (err) => {
              console.error("Error getting location", err);
              setLocation("San Francisco, CA"); // Fallback location
            }
          );
        } else {
          console.error("Geolocation permission denied or unsupported.");
          setLocation("San Francisco, CA"); // Fallback location
        }
      } catch (error) {
        console.error("Error checking geolocation permission", error);
        setLocation("San Francisco, CA"); // Fallback location
      }
    };

    getLocation();
  },[]);

  return null;
};

LocationPermissionComponent.propTypes = {
  setLocation: PropTypes.func.isRequired,
};

export default LocationPermissionComponent;
