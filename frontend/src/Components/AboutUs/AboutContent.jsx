import React from "react";
import aboutImg from "../../assets/images/about/aastha-about.png"; 
import aboutImg1 from "../../assets/images/about/aastha-about1.png"; 
import aboutImg2 from "../../assets/images/about/aastha-about2.png"; 

const AboutContent = () => {
  return (
    <section className="section-area section-sp1 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 m-b30 pe-lg-5 wow fadeInUp" data-wow-delay="0.1s">
             <div className="row g-3">
               <div className="col-6">
                  <img src={aboutImg} alt="About Us 1" className="img-fluid " />
               </div>
               <div className="col-6">
                  <img src={aboutImg1} alt="About Us 2" className="img-fluid " />
              </div>
              <div className="col-12">
                 <img src={aboutImg2} alt="About Us 3" className="img-fluid" />
              </div>
             </div>
           </div>

          <div className="col-lg-6 m-b30">
            <div className="heading-bx style1 wow fadeInUp" data-wow-delay="0.2s">
              <h2 className="title-head-sm">
                 Understanding Aastha Chits: A Traditional Savings and Lending Solution in Bengaluru
              </h2>
              <p className="mw-100">
                Aastha Chits is a reliable and transparent chit fund company based in Chandra Layout, Bangalore, 
                dedicated to helping individuals and businesses achieve financial stability through secure savings and investment plans.
              </p>
              <p className="mw-100">
                With a strong reputation for integrity, customer trust, and legally compliant operations, we offer a range of flexible chit 
                fund schemes that cater to salaried professionals, entrepreneurs, and self-employed individuals. Our goal is to make financial planning simple, 
                secure, and rewarding for everyone.
              </p>
            </div>

            <ul className='list-style1 m-0'>
                <li>Flexible Chit Plans</li>
                <li>Transparent Bidding Process</li>
                <li>On-Time Payouts</li>
                <li>Dedicated Member Support</li>
                <li>Offline & Online Assistance</li>
                <li>Strong Community Network</li>
              </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
