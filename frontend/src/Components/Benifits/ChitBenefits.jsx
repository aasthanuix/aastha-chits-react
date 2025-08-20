import React from 'react';
import './Benefits.css';
import chitImage from '../../assets/images/benefits/benefits.png'; 

const ChitBenefits = () => {
  return (
    <section className="chit-benefits">
      <div className="benefits-container">
        <div className="benefits-image">
          <img src={chitImage} alt="Chit Fund Benefits" />
        </div>
        <div className="benefits-content heading-bx style1">
          <h2 className='title-head-sm'>Benefits of investing in Aastha Chits</h2>
          <p className='justify-start mw-100 p-0' >Aastha Chits offers a smart, secure, and 
            flexible way to manage your finances. Our chit fund schemes help
            you save regularly while giving you quick access to lump-sum funds 
            without collateral. Whether you're planning a personal goal, facing an emergency,
            or funding a business, our plans are designed to suit all income levels. With transparent processes,
            legal compliance, and a trusted community network, Aastha Chits empowers you to achieve your financial goals confidently and easily.
          </p>         
          <ul className='list-style1 mt-2'>
            <li style={{fontSize: 16}}>Encourages regular saving habits</li>
            <li style={{fontSize: 16}}>Access to lump-sum funds in emergencies</li>
            <li style={{fontSize: 16}}>No collateral needed for borrowing</li>
            <li style={{fontSize: 16}}>Flexible plans for different income groups</li>
            <li style={{fontSize: 16}}>Combines saving and borrowing in one platform</li>
            <li style={{fontSize: 16}}>Ideal for small business and personal finance needs</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ChitBenefits;
