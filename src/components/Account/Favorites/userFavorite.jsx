import { useSelector } from "react-redux";
import {
  useDestroyFavoritesMutation,
  useFetchFavoritesQuery,
} from "./favoriteSlice";
import { selectUserId } from "../../Login/LoginSlice";
import Navigation from "../../Navigations/Navigations";
import Footer from "../../Footer/Footer";
import { useEffect } from "react";
import "./favorite.css";

export default function UserFavorite() {
  const userId = useSelector(selectUserId);
  const { data: favorites = [], refetch } = useFetchFavoritesQuery(userId);

  const [destroyFavorite, { isLoading: isDestroying }] =
    useDestroyFavoritesMutation();

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  const handleRemoveFavorite = async (restaurantId) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    if (!restaurantId) {
      console.error("Restaurant ID is not available");
      return;
    }

    try {
      console.log(`Attempting to remove favorite with ID: ${restaurantId}`);
      await destroyFavorite({
        userId,
        favoriteRestaurantId: restaurantId,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <div className="favoritePage">
      <Navigation />
      <div className="favorite-container">
        <div className="favorites-column">
          <h2 className="favoritesWorld">My Favorites</h2>
        </div>
        <div className="divider"></div>
        <div className="favorites">
          {favorites.length === 0 ? (
            <div>No favorite restaurants found</div>
          ) : (
            favorites.map((restaurant) => (
              <div key={restaurant.id}>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.formatted_address}</p>
                <p>Rating: {restaurant.rating}</p>
                <button
                  className="favoriteBotao"
                  onClick={() => handleRemoveFavorite(restaurant.id)}
                  disabled={isDestroying}
                >
                  {isDestroying ? "Removing..." : "Remove from Favorites"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
