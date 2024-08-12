/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { fetchYelpData } from "./YelpSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Favorites2 from "../Shared/Favorites2";

const Carousel = ({ data }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="yelp-carousel">
      <Slider {...settings}>
        {data.businesses &&
          data.businesses.map((business) => (
            <div key={business.id} className="restaurant-card">
              <img
                src={business.image_url}
                alt={business.name}
                className="restaurant-image"
              />
              <h2>{business.name}</h2>
              <p>Average Rating: {business.rating}</p>
              <p>Phone Number: {business.display_phone}</p>
              <p>{business.price}</p>
            </div>
          ))}
      </Slider>
    </div>
  );
};

const YelpSearch = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.yelp);
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = `${latitude},${longitude}`;
            setLocation(location);

            const categories = "restaurants,bars";
            dispatch(fetchYelpData({ location, categories }));
          },
          (err) => {
            console.error("Error getting location", err);
            const fallbackLocation = "San Francisco, CA";
            const categories = "restaurants,bars";
            setLocation(fallbackLocation);

            dispatch(fetchYelpData({ location: fallbackLocation, categories }));
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        const fallbackLocation = "San Francisco, CA";
        const categories = "restaurants,bars";
        setLocation(fallbackLocation);

        dispatch(fetchYelpData({ location: fallbackLocation, categories }));
      }
    };

    getLocation();
  }, [dispatch]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading data</p>}
      {data && <Carousel data={data} />}
    </div>
  );
};

export default YelpSearch;
