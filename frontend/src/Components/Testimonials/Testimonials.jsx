import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import avatar from '../../assets/images/testimonials/avatar.png';
import arrow from '../../assets/images/testimonials/arrow.svg';

const testimonials = [
  {
    id: 1,
    name: 'Nirmal C P',
    text: 'very good service for the people in bangalore. friendly staff. always ready help by giving good suggestions which help us to grow financially. thank you soo much Astha group.',
    avatar: avatar,
  },
  {
    id: 2,
    name: 'Venkata Reddy',
    text: 'Good experience, at end of the movement, settlement is little delay but in single shot cleared, overall excellent 👌.',
    avatar: avatar,
  },
  {
    id: 3,
    name: 'Sahana S', 
    text: 'Good service and best investment for future.',
    avatar: avatar,
  },
  {
    id: 4,
    name: 'Arun Shetty', 
    text: 'Thank you aastha chits for super savings platform',
    avatar: avatar,
  },
   {
    id: 5,
    name: 'Srinivas Banda', 
    avatar: avatar,
  },
];

const Testimonials = () => {
  return (
    <section className="section-area section-sp1 testimonial-section-one bg-white">
      <div className="container">
        <img className="testimonial-avatar avatar1" src={avatar} alt="" />
        <img className="testimonial-avatar avatar2" src={avatar} alt="" />
        <img className="testimonial-avatar avatar3" src={avatar} alt="" />
        <img className="testimonial-avatar avatar4" src={avatar} alt="" />
        <img className="testimonial-avatar avatar5" src={avatar} alt="" />

        <div className="row">
          <div className="col-lg-6 position-relative">
            <div className="heading-bx style1 mb-lg-5">
              <h2 className="title-head m-b0">
                <span className='text-primary'>Success Stories</span> with Aastha Chits
              </h2>
              <p>
                Words from our members that reflect years of service and satisfaction.
              </p>
            </div>
            <img className="arrow" src={arrow} alt="" />
          </div>

          <div className="col-lg-6">
            <div className="testimonial-wrapper-one">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                navigation={{
                  nextEl: '.testimonial-btn-next1',
                  prevEl: '.testimonial-btn-prev1',
                }}
                pagination={{
                    el: '.swiper-pagination-progressbar',
                    type: 'progressbar',
                }}
                className="testimonial-swiper"

              >
                {testimonials.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="testimonial-card">
                      <div className="rating-wrap">
                        <div className="d-flex">
                          {[...Array(5)].map((_, i) => (
                             <FontAwesomeIcon key={i} icon={faStar} className="text-primary me-1" />
                          ))}
                        </div>                        
                      </div>
                      <div className="testimonial-content">
                        <p>{item.text}</p>
                      </div>
                      <div className="testimonial-info">
                        <div className="testimonial-thumb">
                          <img src={item.avatar} alt={item.name} />
                        </div>
                        <div className="clearfix">
                          <h6 className="testimonial-name">{item.name}</h6>
                          <p>{item.field}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="pagination-wrapper">
                 <div className="testimonial-btn-prev1 swiper-button-prev">
                   <FontAwesomeIcon icon={faArrowLeft} />
                 </div>
                 <div className="testimonial-btn-next1 swiper-button-next">
                   <FontAwesomeIcon icon={faArrowRight} />
                 </div>
                 <div className="swiper-pagination-progressbar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
