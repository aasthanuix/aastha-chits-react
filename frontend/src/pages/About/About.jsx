import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import AboutContent from '../../Components/AboutUs/AboutContent'
import WhyUs from '../../Components/AboutUs/WhyUs'
import Footer from '../../Components/Footer/Footer'
import OurGoals from '../../Components/AboutUs/OurGoals'

const About = () => {
  return (
    <div className='about-section'>
      <Navbar />
      <Breadcrumb title="About Us"/>
      <AboutContent />
      <WhyUs />
      <OurGoals />
      <Footer />
    </div>
  )
}

export default About
