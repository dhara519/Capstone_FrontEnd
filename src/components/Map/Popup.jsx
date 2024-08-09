import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Popup.css";

const Popup = ({ show, handleClose, children }) => {
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, handleClose]);

  return (
    <div className={`popup ${show ? "show" : ""}`}>
      <div className="popup-inner" ref={popupRef}>
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

Popup.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Popup;
