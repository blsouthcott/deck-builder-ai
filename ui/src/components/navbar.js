import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePowerpoint } from '@fortawesome/free-regular-svg-icons';


const Navbar = () => {

  const [isActive, setIsActive] = useState(false);

  const toggleBurger = () => {
    setIsActive(!isActive);
  }

  return (
    <nav className="navbar is-fixed-top">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <FontAwesomeIcon icon={faFilePowerpoint} />
        </Link>
        <button
          className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
          data-target="navbar"
          onClick={toggleBurger}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div id="navbar" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link className="navbar-item" to="/">
            Generate Presentation
          </Link>
          <Link className="navbar-item" to="/generate-presentation-ideas">
            Generate Presentation Ideas
          </Link>
        </div>
      </div>

    </nav>
  )
}

export default Navbar;