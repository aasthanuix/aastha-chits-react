import React from 'react';
import './Breadcrumb.css';
import bannerImage from '../../assets/images/banner/chits-breadcrumb.png'; 

const Breadcrumb = ({title}) => {
  return (
    <div
      className="breadcrumb-section"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <h6 className="breadcrumb-title">{title}</h6>
    </div>
  );
};

export default Breadcrumb ;
