import YelpSearch from "../Restaurants/Restaurant";
import "./HomePage.css";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <h1>Discover the Best Restaurants in Town</h1>
          <p>Honest reviews from food lovers, for food lovers.</p>
          <Link to="/MapPage" className="hero-button">
            Browse Reviews
          </Link>
        </div>
      </div>
      <div className="about" id="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are passionate about food and bringing you the best dining
            experiences. Our team of reviewers visits each restaurant to give
            you an authentic taste of what to expect.
          </p>
        </div>
      </div>
      <div className="yelp-search-container">
        {/* <p className="nearby">
          {" "}
          We are passionate about food and bringing you the best dining
          experiences. Our team of reviewers visits each restaurant to give you
          
          an authentic taste of what to expect. See what you can book tonight!
        </p> */}
        <YelpSearch />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
