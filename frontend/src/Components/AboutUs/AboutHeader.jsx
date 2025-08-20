import React from "react";
import star1 from "../../assets/images/star/star1.svg";
import star2 from "../../assets/images/star/star2.svg";


const AboutHeader = () => {
  return (
    <div className="page-banner bg-ovrl1">
      <div className="container">
        <div className="row align-items-center h-100">
          <div className="col-xl-5 col-lg-6 col-md-10">
            <div className="page-banner-entry">
              <img className="animted-star star1" src="" alt="" />
              <img className="animted-star star2" src="" alt="" />
              <h1 className="wow fadeInUp" data-wow-delay="0.1s">
                About Us
              </h1>              
            </div>
          </div>
          <div className="col-xl-7 col-lg-6 d-none d-lg-block">
            <div className="banner-img wow fadeInRight" data-wow-delay="0.3s">
              <img src="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHeader;
