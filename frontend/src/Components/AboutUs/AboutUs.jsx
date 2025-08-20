import React from 'react';
import aboutImage from '../../assets/images/about/aastha-abt.png'


const AboutUs = () => {
  return (
    <section className="section-area section-sp2 bg-primary about-section-one">
      <div className="container">
        <div className="row align-items-center">         
          <div className="col-xl-12 col-lg-12 mb-3">                         
              <h2 className="title-head-sm text-center text-white">
                  Empowering with Smart Chit Fund Solutions
              </h2>                            
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-6 m-b30">
            <div className="featured-bx1">
              <img src={aboutImage} alt="Aastha Chits" />           
            </div>   
          </div>       
          <div className="col-xl-6">
            <div className='heading-bx style1'>
            <p className="text-white mw-100">
              At Aastha Chits, we understand that saving money and planning for the future isn’t always easy and that’s exactly why we’re here. Based in Chandra Layout, Bangalore, we’ve been helping individuals and businesses achieve their financial goals through simple, secure, and transparent chit fund solutions.
            </p>
            <p className=" text-white mw-100">
              Over the years, we’ve built more than just a customer base — we’ve built trust. Whether you're a salaried employee trying to build your savings, a small business owner managing cash flow, or an entrepreneur looking for flexible funding options, our plans are tailored to fit your needs.
              We’re proud to offer legally compliant, risk-mitigated chit plans backed by a team that genuinely cares. At Aastha Chits, we believe financial planning should be clear, flexible, and rewarding — not complicated or stressful.
            </p>  
            </div>
            <div className="features">
              <ul className='list-style1 text-white m-0'>
                <li>Flexible Chit Plans</li>
                <li>Transparent Bidding Process</li>
                <li>On-Time Payouts</li>
                <li>Dedicated Member Support</li>
                <li>Offline & Online Assistance</li>
                <li>Strong Community Network</li>
              </ul>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <a href="/about" className="btn btn-light text-primary">Read More</a>
              </div>
            </div>          
          </div>
        </div>
      </div>   
  </section>
  );
};

export default AboutUs;