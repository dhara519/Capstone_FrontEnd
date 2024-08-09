import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import {
  usePostFavoritesMutation,
  useDestroyFavoritesMutation,
} from "../Account/Favorites/favoriteSlice";
import { selectUserId } from "../Login/LoginSlice";
import { useNavigate } from "react-router-dom";
import "./Favorites2.css";

export default function Favorites2({ restaurant }) {
  const userId = useSelector(selectUserId);
  const [postFavorite] = usePostFavoritesMutation();
  const [destroyFavorite] = useDestroyFavoritesMutation();
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Restaurant prop:", restaurant);
  }, [restaurant]);

  const handleAddFavorite = async () => {
    if (!restaurant || !restaurant.place_id) {
      console.error("Restaurant data is missing or incomplete.");
      return;
    }

    try {
      const token = window.sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      const obj = {
        userId,
        place_id: restaurant.place_id,
        name: restaurant.name,
        formatted_address: restaurant.formatted_address || "",
        rating: restaurant.rating || 0,
        types: restaurant.types || [],
        source: restaurant.name,
      };
      const response = await postFavorite(obj).unwrap();
      setIsHeartFilled(true);
      setFavoritesList((prevList) => [
        ...prevList,
        { ...obj, id: response.id },
      ]); // Include the returned ID

      console.log("Added favorite:", response);
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!restaurant || !restaurant.place_id) {
      console.error("Restaurant data is missing or incomplete.");
      return;
    }

    // Find the favorite restaurant by place_id
    const favorite = favoritesList.find(
      (fav) => fav.place_id === restaurant.place_id
    );

    if (!favorite) {
      console.error("Restaurant is not in the favorites list.");
      return;
    }

    try {
      const token = window.sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }
      console.log("Removing favorite:", {
        userId,
        favoriteRestaurantId: favorite.id,
      });
      await destroyFavorite({
        userId,
        favoriteRestaurantId: favorite.id, // Use the favorite restaurant ID
      }).unwrap();
      setIsHeartFilled(false);
      setFavoritesList((prevList) =>
        prevList.filter((fav) => fav.id !== favorite.id)
      );
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const toggleHeart = () => {
    if (isHeartFilled) {
      handleRemoveFavorite();
    } else {
      handleAddFavorite();
    }
  };

  if (!restaurant) {
    return <div>No restaurant data provided.</div>;
  }

  return (
    <div>
      <button className="btn-link" onClick={toggleHeart}>
        <FontAwesomeIcon icon={isHeartFilled ? faSolidHeart : faRegularHeart} />
      </button>
    </div>
  );
}
