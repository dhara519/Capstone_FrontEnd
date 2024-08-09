import { useState } from "react";

const MapSearch = ({ onSearch }) => {
  const [searchedLocation, setSearchedLocation] = useState("");

  const handleSearch = () => {
    onSearch(searchedLocation);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <input
        type="text"
        value={searchedLocation}
        onChange={(e) => setSearchedLocation(e.target.value)}
        placeholder="Enter location"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default MapSearch;
