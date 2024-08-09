import PropTypes from "prop-types";
import "./RestaurantList.css";
import Favorites2 from "../Shared/Favorites2";

const RestaurantList = ({ restaurants }) => {
  return (
    <div className="restaurant-list">
      <h2>Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>No restaurants found</p>
      ) : (
        restaurants.map((restaurant, index) => {
          console.log("Restaurant data:", restaurant);

          return (
            <div key={index} className="restaurant-item">
              <div>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.formatted_address}</p>
              </div>
              <Favorites2 restaurant={restaurant} />
            </div>
          );
        })
      )}
    </div>
  );
};

RestaurantList.propTypes = {
  restaurants: PropTypes.array.isRequired,
};

export default RestaurantList;
