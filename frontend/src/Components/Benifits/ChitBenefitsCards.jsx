import React from 'react';
import './Benefits.css';
import benefit1 from '../../assets/images/benefits/benefit1.png';
import benefit2 from '../../assets/images/benefits/benefit2.png';
import benefit3 from '../../assets/images/benefits/benefit3.png';
import benefit4 from '../../assets/images/benefits/benefit4.png';
import benefit5 from '../../assets/images/benefits/benefit5.png';
import benefit6 from '../../assets/images/benefits/benefit6.png';
import benefit7 from '../../assets/images/benefits/benefit7.png';
import benefit8 from '../../assets/images/benefits/benefit8.png';
import benefit9 from '../../assets/images/benefits/benefit9.png';

const benefits = [
  {  image:benefit1, title: 'Dual Purpose', description: 'Acts as both a savings method and a borrowing tool.' },
  {  image:benefit2, title: 'Flexible Plans', description: 'Choose chit plans that suit your budget and needs.' },
  {  image:benefit3, title: 'No Collateral Needed', description: 'Access funds without any assets or guarantees.' },
  {  image:benefit5, title: 'Quick Access to Funds', description: 'Receive money quickly during financial needs.' },
  {  image:benefit4, title: 'Disciplined Savings', description: 'Encourages regular monthly savings.' },
  {  image:benefit6, title: 'Legally Regulated', description: 'Governed under the Chit Funds Act for transparency.' },
  {  image:benefit7, title: 'Community Support', description: 'Built on trust among group members.' },
  {  image:benefit8, title: 'Simple Process', description: 'Less paperwork compared to banks and loans.' },
  {  image:benefit9, title: 'Emergency Help', description: 'Access emergency funds without waiting.' },
];

const ChitBenefitsCards = () => {
  return (
    <section className="benefits-card-section">
      <div className="container">        
        <div className="row">
          {benefits.map((benefit, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={index}>
              <div className="benefit-card">
                <img src={benefit.image} alt={benefit.title} className="benefit-image" />
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChitBenefitsCards;
