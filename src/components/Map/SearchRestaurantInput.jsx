import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./google.css";
import "./SearchRestaurantInput.css";
import Popup from "./Popup";

const cuisineOptions = [
  "Lunch",
  "Pizza",
  "Vegan",
  "Vegetarian",
  "Burgers",
  "Spanish",
  "American",
  "Thai",
  "Chinese",
  "Brunch",
  "Indian",
  "Deli",
];
const suggestedOptions = [
  "Open Now",
  "Offers Delivery",
  "Offers Takeout",
  "Outdoor Seating",
];
const additionalFeatures = [
  "Accepts Apple Pay",
  "Accepts Credit Cards",
  "Happy Hour Menu",
  "Free Wi-Fi",
  "Takes Reservations",
  "Pets Allowed",
];

const SearchRestaurantInput = ({ onSearch, location, initialCuisine }) => {
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedSuggested, setSelectedSuggested] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showMoreCuisine, setShowMoreCuisine] = useState(false);
  const [showMoreSuggested, setShowMoreSuggested] = useState(false);
  const [showMoreFeature, setShowMoreFeature] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (location) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", { timeZone });
      setCurrentTime(timeString);
    }
  }, [location]);

  useEffect(() => {
    if (initialCuisine && location) {
      searchRestaurants(
        initialCuisine,
        selectedSuggested,
        selectedFeature,
        location
      );
    }
  }, [initialCuisine, location]);

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine);
    if (cuisine && location) {
      searchRestaurants(cuisine, selectedSuggested, selectedFeature, location);
    }
  };

  const handleSuggestedSelect = (suggested) => {
    setSelectedSuggested(suggested);
    if (selectedCuisine && location) {
      searchRestaurants(selectedCuisine, suggested, selectedFeature, location);
    }
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    if (selectedCuisine && location) {
      searchRestaurants(selectedCuisine, selectedSuggested, feature, location);
    }
  };

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
          onSearch(results);
        } else {
          console.error("Error fetching places:", status);
          onSearch([]);
        }
      }
    );
  };

  const visibleCuisineOptions = showMoreCuisine
    ? cuisineOptions
    : cuisineOptions.slice(0, 5);
  const visibleSuggestedOptions = showMoreSuggested
    ? suggestedOptions
    : suggestedOptions.slice(0, 5);
  const visibleFeatureOptions = showMoreFeature
    ? additionalFeatures
    : additionalFeatures.slice(0, 5);

  return (
    <div className="search-container">
      <div
        className={`filter-container ${
          showMoreCuisine || showMoreSuggested || showMoreFeature
            ? "popup-background"
            : ""
        }`}
      >
        <div className="filter-2">
          <h3>Filter By</h3>
          {visibleSuggestedOptions.map((suggestedOption, index) => (
            <div
              key={index}
              className={`suggested-option ${
                showMoreSuggested ? "hidden-options" : ""
              }`}
            >
              <input
                type="checkbox"
                id={`suggested-${index}`}
                name="suggested"
                value={suggestedOption}
                checked={selectedSuggested === suggestedOption}
                onChange={() => handleSuggestedSelect(suggestedOption)}
              />
              <label
                htmlFor={`suggested-${index}`}
                className={`suggested-label ${
                  selectedSuggested === suggestedOption ? "selected" : ""
                }`}
              >
                {suggestedOption === "Open Now"
                  ? `${suggestedOption} [${currentTime}]`
                  : suggestedOption}
              </label>
            </div>
          ))}
          {suggestedOptions.length > 5 && (
            <button
              className="see-more-button"
              onClick={() => setShowMoreSuggested(!showMoreSuggested)}
            >
              {showMoreSuggested ? "See Less" : "See all"}
            </button>
          )}
        </div>
        <div className="filter-2">
          <h3>Cuisine</h3>
          {visibleCuisineOptions.map((cuisineOption, index) => (
            <div
              key={index}
              className={`cuisine-option ${
                selectedCuisine === cuisineOption ? "selected" : ""
              } ${showMoreCuisine ? "hidden-options" : ""}`}
              onClick={() => handleCuisineSelect(cuisineOption)}
            >
              <label htmlFor={`cuisine-${index}`} className="cuisine-label">
                {cuisineOption}
              </label>
            </div>
          ))}
          {cuisineOptions.length > 5 && (
            <button
              className="see-more-button"
              onClick={() => setShowMoreCuisine(!showMoreCuisine)}
            >
              {showMoreCuisine ? "See Less" : "See all"}
            </button>
          )}
        </div>
        <div className="filter-2">
          <h3>Available Options</h3>
          {visibleFeatureOptions.map((featureOption, index) => (
            <div
              key={index}
              className={`feature-option ${
                showMoreFeature ? "hidden-options" : ""
              }`}
            >
              <input
                type="checkbox"
                id={`feature-${index}`}
                name="feature"
                value={featureOption}
                checked={selectedFeature === featureOption}
                onChange={() => handleFeatureSelect(featureOption)}
              />
              <label
                htmlFor={`feature-${index}`}
                className={`feature-label ${
                  selectedFeature === featureOption ? "selected" : ""
                }`}
              >
                {featureOption}
              </label>
            </div>
          ))}
          {additionalFeatures.length > 5 && (
            <button
              className="see-more-button"
              onClick={() => setShowMoreFeature(!showMoreFeature)}
            >
              {showMoreFeature ? "See Less" : "See all"}
            </button>
          )}
        </div>
      </div>

      {/* Popup for Cuisine Options */}
      <Popup
        show={showMoreCuisine}
        handleClose={() => setShowMoreCuisine(false)}
      >
        <div className="popup-content">
          <h3>Cuisine Options</h3>
          {cuisineOptions.map((cuisineOption, index) => (
            <div
              key={index}
              className="option"
              onClick={() => handleCuisineSelect(cuisineOption)}
            >
              <input
                type="checkbox"
                id={`popup-cuisine-${index}`}
                name="cuisine"
                value={cuisineOption}
                checked={selectedCuisine === cuisineOption}
                onChange={() => handleCuisineSelect(cuisineOption)}
              />
              <label htmlFor={`popup-cuisine-${index}`}>{cuisineOption}</label>
            </div>
          ))}
        </div>
      </Popup>
      {/* Popup for Feature Options */}
      <Popup
        show={showMoreFeature}
        handleClose={() => setShowMoreFeature(false)}
      >
        <div className="popup-content">
          <h3>Available Options</h3>
          {additionalFeatures.map((featureOption, index) => (
            <div key={index} className="option">
              <input
                type="checkbox"
                id={`popup-feature-${index}`}
                name="feature"
                value={featureOption}
                checked={selectedFeature === featureOption}
                onChange={() => handleFeatureSelect(featureOption)}
              />
              <label htmlFor={`popup-feature-${index}`}>{featureOption}</label>
            </div>
          ))}
        </div>
      </Popup>
    </div>
  );
};

SearchRestaurantInput.propTypes = {
  onSearch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  initialCuisine: PropTypes.string,
};

export default SearchRestaurantInput;
