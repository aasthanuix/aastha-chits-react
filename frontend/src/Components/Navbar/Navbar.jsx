import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/aastha-chits-logo.png';
import arrowIcon from '../../assets/images/icon/arrow.svg';
import { FiPhoneCall } from 'react-icons/fi';
// import './Navbar.css'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="main-navbar sticky-header">
        <div className="navbar navbar-expand-lg no-shadow">
          <div className="container-fluid">

            <Link to="/" className="navbar-brand" aria-label="Aastha Chits logo">
              <img className="brand-logo" src={logo} alt="Aastha Chits logo" />
            </Link>

            

            {/* Navigation Menu */}
            <nav className={`navigation-list navbar-collapse justify-content-end ${isMenuOpen ? 'show' : 'collapse'}`}>
              <ul className="nav navbar-nav">
                <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
                <li><Link to="/chits-plans" onClick={closeMenu}>Chits Plans</Link></li>
                <li><Link to="/chits-benefits" onClick={closeMenu}>Benefits</Link></li>
                <li><Link to="/contact-us" onClick={closeMenu}>Contact Us</Link></li>
                <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              </ul>
            </nav>

            {/* Action Items */}
            <div className="action-nav d-none d-sm-flex">
              <ul>
                <li className="d-none d-xl-inline-block me-xxl-5 me-xl-2">
                  <a href="tel:+917676973099" className="header-phone">
                    <FiPhoneCall className="text-primary me-2" style={{ width: 40, height: 28 }} />
                    +91 76769 73099
                  </a>
                </li>
                <li>
                  <Link to="/contact-us" className="btn btn-secondary btn-standard">
                    Contact Us
                    <span className="btn-icon">
                      <img src={arrowIcon} alt="arrow" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Toggle Button */}
            <div className="mobile-toggler d-lg-none">
              <button className="navbar-toggler" onClick={toggleMenu} aria-label="Toggle navigation">
                <span className="toggler-line"></span>
                <span className="toggler-line"></span>
                <span className="toggler-line"></span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
