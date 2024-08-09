import { useState } from "react";
import MapFunction from "./GoogleMap";
import LocationPermissionComponent from "../LocationPermission/LocationPermissionComponent";
import Footer from "../Footer/Footer";

const MapPage = () => {
  // state to store user's location
  const [location, setLocation] = useState(null);
  // state to store search results
  const [places, setPlaces] = useState([]);

  const handleSearch = (results) => {
    setPlaces(results);
  };

  return (
    <div>
      <LocationPermissionComponent setLocation={setLocation} />
      <MapFunction location={location} places={places} />
      <Footer />
    </div>
  );
};

export default MapPage;
