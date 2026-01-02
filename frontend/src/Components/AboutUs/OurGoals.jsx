import React from 'react';

import goalImg from '../../assets/images/goals/aastha-goals.png'
import goal1 from '../../assets/images/goals/goal-1.png';
import goal2 from '../../assets/images/goals/goal-2.png';
import goal3 from '../../assets/images/goals/goal-3.png';

const OurGoals = () => {
  return (
    <section className="section-area section-sp1 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-4">
            <div className="row align-items-center">
              <div className="col-xl-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="m-b15">
                  <img src={goalImg} alt="Aastha Chits Goals" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-8 ps-xxl-5">
            <div className="row align-items-end">
              <div className="col-lg-12 col-md-12 m-b30 wow fadeInUp" data-wow-delay="0.3s">
                <div className="heading-bx style1 mb-0">
                  <h2 className="title-head-sm m-b0">Our Commitment to Your Financial Goals</h2>
                </div>
              </div>              
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-6 m-b30 wow fadeInUp" data-wow-delay="0.5s">
                <div className="featured-bx1 data-item-hover bg-white">
                  <div
                    className="featured-media data-img-hover"
                    data-displacement="assets/libs/tree/effect6.jpg"
                    data-intensity="0.2"
                    data-speedin="1"
                    data-speedout="1"
                  >
                    <img src={goal2} alt="Goal 1" />
                  </div>
                  <div className="featured-content">
                    <h3 className="featured-title">
                      <a className="stretched-link">Daily Financial Guidance</a>
                    </h3>
                    <p>Stay informed with expert advice to help you reach your financial milestones with ease.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 m-b30 wow fadeInUp" data-wow-delay="0.6s">
                <div className="featured-bx1 data-item-hover bg-white">
                  <div
                    className="featured-media data-img-hover"
                    data-displacement="assets/libs/tree/effect6.jpg"
                    data-intensity="0.2"
                    data-speedin="1"
                    data-speedout="1"
                  >
                    <img src={goal1} alt="Goal 2" />
                  </div>
                  <div className="featured-content">
                    <h3 className="featured-title">
                      <a className="stretched-link">Consistent Returns</a>
                    </h3>
                    <p>Our structured chit plans ensure returns that are both reliable and rewarding.</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 m-b30 wow fadeInUp" data-wow-delay="0.7s">
                <div className="featured-bx1 data-item-hover bg-white">
                  <div
                    className="featured-media data-img-hover"
                    data-displacement="assets/libs/tree/effect6.jpg"
                    data-intensity="0.2"
                    data-speedin="1"
                    data-speedout="1"
                  >
                    <img src={goal3} alt="Goal 3" />
                  </div>
                  <div className="featured-content">
                    <h3 className="featured-title">
                      <a className="stretched-link">Achieve Financial Freedom</a>
                    </h3>
                    <p>Join Aastha Chits to take confident steps toward a financially independent future.</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurGoals;
