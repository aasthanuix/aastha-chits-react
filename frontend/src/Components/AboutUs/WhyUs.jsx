import React from 'react';
import {
  FaUserTie,
  FaBalanceScale,
  FaMoneyBillWave,
  FaClock,
  FaLock,
  FaChartLine
} from 'react-icons/fa';

const WhyUs = () => {
  const benefits = [
    {
      title: 'Trusted by Members',
      delay: '0.1s',
      number: '01',
      icon: <FaUserTie size={48} className="text-primary" />,
      description: 'Hundreds trust Aastha Chits for transparent and secure financial planning.',
    },
    {
      title: 'Legal & Transparent',
      delay: '0.2s',
      number: '02',
      icon: <FaBalanceScale size={48} className="text-primary" />,
      description: 'We operate under strict compliance with chit fund regulations and laws.',
    },
    {
      title: 'Flexible Saving Options',
      delay: '0.3s',
      number: '03',
      icon: <FaMoneyBillWave size={48} className="text-primary" />,
      description: 'Choose from a wide range of chit plans to suit your budget and goals.',
    },
    {
      title: 'Timely Payouts',
      delay: '0.4s',
      number: '04',
      icon: <FaClock size={48} className="text-primary" />,
      description: 'Our commitment to timely payouts builds confidence and peace of mind.',
    },
    {
      title: 'Secure Transactions',
      delay: '0.5s',
      number: '05',
      icon: <FaLock size={48} className="text-primary" />,
      description: 'We ensure your investments and returns are handled with utmost security.',
    },
    {
      title: 'Financial Growth',
      delay: '0.6s',
      number: '06',
      icon: <FaChartLine size={48} className="text-primary" />,
      description: 'Achieve long-term wealth through disciplined and structured savings.',
    },
  ];

  return (
    <div className="section-area bg-primary video-section-bg">
      <div className="container">
        <div className="row section-sp1">
          <div className="col-12">
            <div className="heading-bx style1 text-center wow fadeInUp" data-wow-delay="0.1s">
              <h2 className="text-white" style={{fontSize: 50}}>Why Join Aastha Chits?</h2>
            </div>
          </div>

          {benefits.map((item, index) => (
            <div className="col-xl-4 col-md-6 m-b30 wow fadeInUp" data-wow-delay={item.delay} key={index}>
              <div className="featured-bx6 text-center">
                <div className="featured-icon text-center mb-3">
                  {item.icon}
                </div>
                <div className="featured-content">
                  <h4 className="featured-title">{item.title}</h4>
                  <p>{item.description}</p>
                  <div className="number">{item.number}</div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default WhyUs;
