import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-style1">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer-top">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6 p-l40 p-sm-l15 wow fadeInUp" data-wow-delay="0.6s">
                  <div className="widget footer_widget">
                    <h5 className="footer-title text-white">Quick Links</h5>
                    <ul>
                      <li><a href="/"><span>Home</span></a></li>
                      <li><a href="/about"><span>About Us</span></a></li>
                      <li><a href="/chit-plans"><span>Chit Plans</span></a></li>
                      <li><a href="/benefits"><span>Benefits</span></a></li>
                      <li><a href="/contact-us"><span>Contact Us</span></a></li>
                      <li><a href="/login"><span>Login</span></a></li>
                    </ul>
                  </div>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-6 p-l60 p-sm-l15 wow fadeInUp" data-wow-delay="0.5s">
                  <div className="widget footer_widget">
                    <h5 className="footer-title text-white">Popular Courses</h5>
                    <ul>
                      <li><a href="#"><span>Privacy Policy</span></a></li>
                      <li><a href="#"><span>Terms & Conditions</span></a></li>
                      <li><a href="#"><span>FAQ's</span></a></li>
                      <li><a href="#"><span>NRI Investment</span></a></li>
                      <li><a href="#"><span>Investment on Property</span></a></li>
                      
                    </ul>
                  </div>
                </div>

                <div className="col-lg-5 col-md-4 wow fadeInUp" data-wow-delay="0.4s">
                  <div className="widget footer_widget contact-info">
                    <h5 className="footer-title text-white">Get in touch</h5>
                    <ul>
                      <li>
                        <p>Call us </p>
                        <i className="fas fa-phone-alt"></i><a href="tel:+91 76769 73099" style={{fontSize: 24}}>+91  76769  73099</a>
                      </li>
                      <li>
                        <p>Address</p>
                        <a href="#">
                          1, First Floor, 1st Stage, 3rd Phase, 9th Cross Rd, near Bank of Baroda,
                          behind Hotel Divar, Chandra Layout, Bengaluru, Karnataka 560040
                        </a>
                      </li>
                      <li>
                        <p>Supports</p>
                        <a href="mailto:aasthachits369@gmail.com">aasthachits369@gmail.com</a>
                        <a href="mailto:info@aasthachits.com">info@aasthachits.com</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom text-center text-xl-start wow fadeInUp" data-wow-delay="0.6s">
                <div className="row">
                    <div className="col-12 text-center">
                       <p className="m-b0">
                          Copyright © {new Date().getFullYear()}{" "}
                          <a href="https://aasthachits.com">Aastha Chits</a>. All Rights Reserved. Powered By{" "}
                          <a href="https://aasthanuix.com">Aastha Nuix</a>.
                       </p>
                    </div>                    
                </div>              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
