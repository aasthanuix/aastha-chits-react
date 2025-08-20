import React from 'react'
import './Contact.css'
const Location = () => {
  return (
    <div className='location bg-light'>
      <div className="container section-area">
			<div className="map-frame">
				<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.2093072386756!2d77.52572839999999!3d12.958454399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f47d2b35175%3A0x44acc337d91f8061!2sAastha%20Chits!5e0!3m2!1sen!2sin!4v1753951081022!5m2!1sen!2sin" style={{width:"600", height:"450", style:"border:0", allowFullScreen:"" ,loading:"lazy"}}></iframe>
			</div>
		</div>
    </div>
  )
}

export default Location
