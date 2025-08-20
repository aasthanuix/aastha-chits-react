import React from "react";
import flexibleSavings from '../../assets/images/benefits/flexible-savings.png'
import easyAccess from '../../assets/images/benefits/easy-access.png'
import disciplineSavings from '../../assets/images/benefits/discipline-saving.png'
import transparency from '../../assets/images/benefits/transparency.png'
import collateralNeed from '../../assets/images/benefits/collateral-needed.png'
import betterReturns from '../../assets/images/benefits/better-returns.png'


const benefits = [
  {
    title: "Flexible Savings",
    description: "Save and borrow at the same time, offering dual benefits.",
    frontImage: flexibleSavings,   
    delay: "0.2s",
  },
  {
    title: "Easy Access to Funds",
    description: "Quick access to funds in times of need without heavy paperwork.",
    frontImage: easyAccess, 
    delay: "0.3s",
  },
  {
    title: "Disciplined Saving Habit",
    description: "Encourages regular savings through monthly contributions.",
    frontImage: disciplineSavings, 
    delay: "0.4s",
  },
  {
    title: "No Collateral Needed",
    description: "Borrow money without pledging assets or security.",
    frontImage: collateralNeed,  
    delay: "0.5s",
  },
  {
    title: "High Transparency",
    description: "Well-regulated system ensures trust and transparency.",
    frontImage: transparency,  
    delay: "0.6s",
  },
  {
    title: "Better Returns",
    description: "Higher returns compared to traditional saving schemes.",
    frontImage: betterReturns,  
    delay: "0.7s",
  },
];

const Benefits = () => {
  return (
    <section className="section-area section-sp1 bg-white">
      <div className="container">
        <div className="heading-bx style1 text-center wow fadeInUp" data-wow-delay="0.1s">
          <h2 className="title-head-sm m-b0">Benefits of Chit Funds</h2>
        </div>
        <div className="row">
          {benefits.map((benefit, index) => (
            <div
              className="col-xl-2 col-md-4 col-6 wow flipInY"
              data-wow-delay={benefit.delay}
              key={index}
            >
              <div className="categories-card">
                <div className="categories-card-inner">
                  <div className="categories-card-front text-center">
                    <img className="card-icon" src={benefit.frontImage} alt={benefit.title} />
                    <h3 className="categorie-title">{benefit.title}</h3>
                    
                  </div>
                  <div className="categories-card-back text-center">
                    {/* <img className="card-icon" src={benefit.backImage} alt={benefit.title} /> */}
                    <h3 className="categorie-title">{benefit.description}</h3>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
