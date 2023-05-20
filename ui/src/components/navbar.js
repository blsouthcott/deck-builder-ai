import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePowerpoint } from '@fortawesome/free-regular-svg-icons';


const Navbar = () => {

  return (
    <nav className="navbar is-fixed-top">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <FontAwesomeIcon icon={faFilePowerpoint} />
        </Link>
      </div>
      <div className="navbar-menu">
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