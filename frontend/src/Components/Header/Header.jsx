import React from 'react';
import bgLines from '../../assets/images/banner/bg-lines.png';
import star5 from '../../assets/images/star/star5.svg';
import star6 from '../../assets/images/star/star6.svg';
import arrowIcon from '../../assets/images/icon/arrow.svg';
import thumbnail from '../../assets/images/banner/aastha-chits-header.png';
import client1 from '../../assets/images/banner/client-1.png';
import client2 from '../../assets/images/banner/client-2.png';
import client3 from '../../assets/images/banner/client-3.png';

const Header = () => {
  return (
    <section
      className="hero-banner-one"
      style={{ backgroundImage: `url(${bgLines})` }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="hero-content">
              <img className="animted-star star1" src={star5} alt="Star 1" />
              <img className="animted-star star2" src={star6} alt="Star 2" />
              <h1 className="title m-b20">
                Smart Savings. Reliable Returns. Join <span className='text-primary'> Aastha Chits Today!</span>
              </h1>
              <p>
                Tailored Savings for Salaried Professionals, Entrepreneurs & Families
              </p>
              <a href="/chits-plans" className="btn btn-primary btn-lg btn-standard">
                Chit Plans
                <span className="btn-icon">
                  <img src={arrowIcon} alt="Arrow" />
                </span>
              </a>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6 align-self-end wow fadeInRight" data-wow-delay="0.2s">
            <div className="hero-thumbnail">
              <img src={thumbnail} alt="Hero Thumbnail" />
            </div>
          </div>
        </div>
        <div className="instructors-section wow fadeInLeft" data-wow-delay="0.3s">
          <h6 className="instructors-title">1000+  Happy Families</h6>
          <div className="instructors-avatars">
            <img src={client1} alt="Instructor 1" />
            <img src={client3} alt="Instructor 2" />
            <img src={client2} alt="Instructor 3" />
            <div className="more-instructors">
              <i className="fi fi-rr-plus"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
