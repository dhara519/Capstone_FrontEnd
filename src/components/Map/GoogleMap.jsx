import { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { GOOGLEKEY } from "./GoogleMapKey";
import SearchRestaurantInput from "./SearchRestaurantInput";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import LocationPermissionComponent from "../LocationPermission/LocationPermissionComponent";
import RestaurantList from "./RestaurantList";
import { useLocation } from "react-router-dom";
import PropTypes from 'prop-types'

const containerStyle = {
  width: "90vw",
  height: "95vh",
  margin: "auto",
};
const libraries = ["places"];
export default function MapFunction({ location }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${GOOGLEKEY}`,
    libraries,
  });
  const [center, setCenter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const locationParam = useLocation();
  const searchParams = new URLSearchParams(locationParam.search);
  const initialCuisine = searchParams.get("cuisine");

  const handleSearchCuisine = (results) => {
    setRestaurants(results);
    if (results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      setCenter({ lat: lat(), lng: lng() });
    }
  };
  useEffect(() => {
    if (location) {
      const [lat, lng] = location.split(",");
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        setCenter({ lat: parsedLat, lng: parsedLng });
        setUserLocation({ lat: parsedLat, lng: parsedLng });
      } else {
        console.error("Invalid coordinates:", lat, lng);
      }
    }
  }, [location]);
  const searchRestaurants = (cuisine, suggested, feature, location) => {
    let query = `${cuisine} restaurants`;
    if (suggested) {
      query += ` ${suggested}`;
    }
    if (feature) {
      query += ` ${feature}`;
    }
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    placesService.textSearch(
      {
        query,
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: 10000, // 10km radius
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          handleSearchCuisine(results);
        } else {
          console.error("Error fetching places:", status);
          handleSearchCuisine([]);
        }
      }
    );
  };
  useEffect(() => {
    if (initialCuisine && userLocation) {
      searchRestaurants(initialCuisine, null, null, userLocation);
    }
  }, [initialCuisine, userLocation]);
  const handleSearchLocation = (searchedLocation) => {
    const geocodeEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLEKEY}&address=${encodeURIComponent(
      searchedLocation
    )}`;
    fetch(geocodeEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          setCenter({ lat, lng });
          setUserLocation({ lat, lng });
        } else {
          console.error("Geocoding API request failed:", data.status);
        }
      })
      .catch((error) => {
        console.error("Error fetching geocoding data:", error);
      });
  };
  const postFavorite = async (restaurantId) => {
    const response = await fetch(
      `https://bringitalltogether-3.onrender.com/api/user/${user.id}/favorite_restaurant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurantId }),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };
  const handleAddFavorite = async (restaurant) => {
    if (!restaurant || !restaurant.id) {
      console.error("Invalid restaurant object");
      return;
    }
    try {
      const response = await postFavorite(restaurant.id);
      console.log("Favorite added:", response);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };
  // Function to handle marker loading and adding event listener for clicks
  const handleMarkerLoad = (marker, restaurant) => {
    google.maps.event.addListener(marker, "click", () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      infoWindowRef.current = new google.maps.InfoWindow({
        content: `
          <div class="restaurantHoverCard">
            <h2>${restaurant.name}</h2>
            <p>${restaurant.formatted_address}</p>
            <button
              type="submit"
              class="btn btn-primary"
              onclick="(${() => handleAddFavorite(restaurant)})()"
            >
              Add Favorite
            </button>
          </div>
        `,
      });
      infoWindowRef.current.open(mapRef.current, marker);
    });
  };
  if (loadError) return <div>Error loading maps</div>;
  return isLoaded ? (
    <div className="parent">
      <LocationPermissionComponent
        setLocation={(loc) => {
          const [lat, lng] = loc.split(",");
          setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
          setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
        }}
      />
      <div className="sidebar">
        <PlacesAutocompleteComponent
          setSelected={setSelected}
          setCenter={setCenter}
          onSearch={handleSearchLocation}
        />
        {userLocation && (
          <SearchRestaurantInput
            onSearch={handleSearchCuisine}
            location={userLocation}
            initialCuisine={initialCuisine}
          />
        )}
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {restaurants.map((restaurant, index) => {
          const restaurantPosition = {
            lat: restaurant.geometry.location.lat(),
            lng: restaurant.geometry.location.lng(),
          };
          return (
            <Marker
              key={index}
              position={restaurantPosition}
              title={restaurant.name}
              onLoad={(marker) => handleMarkerLoad(marker, restaurant)}
            />
          );
        })}
        {selected && <Marker position={selected} />}
      </GoogleMap>
      <RestaurantList restaurants={restaurants} />
    </div>
  ) : (
    <></>
  );
}
const PlacesAutocompleteComponent = ({ setSelected, setCenter, onSearch }) => {
  // state to store the searched town
  const [town, setTown] = useState("");
  // Handler for selecting a town from autocomplete suggestions
  const handleSelect = async (town) => {
    setTown(town);
    const results = await geocodeByAddress(town);
    const { lat, lng } = await getLatLng(results[0]); // To get latitude and longitude for the selected town
    setSelected({ lat, lng }); // update selected location state
    setCenter({ lat, lng }); // center map on the selected location
    onSearch(town); // Trigger search callback with the selected town
  };
  return (
    <PlacesAutocomplete
      value={town}
      onChange={setTown}
      onSelect={handleSelect}
      searchOptions={{ types: ["(cities)"] }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: "Search city",
              className: "combobox-input",
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              const style = suggestion.active
                ? { backgroundColor: "#FAFAFA", cursor: "pointer" }
                : { backgroundColor: "#FFFFFF", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                    
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};
