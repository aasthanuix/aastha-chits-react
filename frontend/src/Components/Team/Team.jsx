import React from 'react';
import star3 from '../../assets/images/star/star3.svg';
import star4 from '../../assets/images/star/star4.svg';
import arrowIcon from '../../assets/images/icon/arrow.svg';
import teamBg from '../../assets/images/background/team-bg.png';
import ajayPrasad from '../../assets/images/team/ajay-prasad.png'
import kalaNaidu from '../../assets/images/team/kala-naidu.jpg'
import chitra from '../../assets/images/team/chitra.png'
import kusuma from '../../assets/images/team/kusuma.png'
import manjula from '../../assets/images/team/manjula.png'

const mentors = [
  {
    name: 'Ajay Prasad',
    role: 'Co-Founder',
    image: ajayPrasad
  },
  {
    name: 'Kala S Naidu',
    role: 'Co-Founder',
    image: kalaNaidu
  },
  
];

const mentors1 = [

  {
    name: 'Chitra D N',
    role: 'PRO',
    image: chitra
  },
  {
    name: 'Kusuma',
    role: 'Executive',
    image: kusuma
  },
  {
    name: 'Manjula S',
    role: 'Executive',
    image: manjula
  },
];

const Team = () => {
  return (
    <section
      className="section-area section-sp1 bg-light"
      style={{
        backgroundImage: `url(${teamBg})`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-5 mb-4">
            <div className="heading-bx style1 mb-lg-5">
              <img className="animted-star star1" src={star3} alt="" />
              <img className="animted-star star2" src={star4} alt="" />
              <h2 className="title-head mb-0">
                The Core Team Fueling <span className='text-primary'>Your Money Growth</span>
              </h2>
              <p>Dedicated to helping you achieve financial success.</p>
            </div>

            <ul className="achievement-list mb-md-5">
              <li>
                <div className="achievement-head yellow">1000+  </div>
                <span>Happy Families</span>
              </li>
              <li>
                <div className="achievement-head green">200+</div>
                <span>Trust-Built Relationships</span>
              </li>
              <li>
                <div className="achievement-head pink">9 years</div>
                <span>Experienced Leadership</span>
              </li>
            </ul>            
          </div>

          <div className="col-xl-6 col-lg-7">
            <div className="row">
              {mentors.map((mentor, index) => (
                <div className="col-xl-6 col-sm-6 mb-4" key={index}>
                  <div className="team-member style1">
                    <div className="team-media">
                      <img src={mentor.image} alt={mentor.name} />
                    </div>
                    <div className="team-info">
                      <h3 className="member-name">                        
                          {mentor.name}                        
                      </h3>
                      <span>{mentor.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row">
              {mentors1.map((mentor, index) => (
                <div className="col-xl-4 col-sm-6 mb-4" key={index}>
                  <div className="team-member style1">
                    <div className="team-media">
                      <img src={mentor.image} alt={mentor.name} />
                    </div>
                    <div className="team-info">
                      <h3 className="member-name">                       
                          {mentor.name}                        
                      </h3>
                      <span>{mentor.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
