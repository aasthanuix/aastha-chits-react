import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Header from '../../Components/Header/Header'
import AboutUs from '../../Components/AboutUs/AboutUs'
import ChitSchemes from '../../Components/ChitSchemes/ChitSchemes'
import Benefits from '../../Components/Benifits/Benefits'
import Team from '../../Components/Team/Team'
import Testimonials from '../../Components/Testimonials/Testimonials'
import Footer from '../../Components/Footer/Footer'
import Brochure from '../../Components/Brochure/Brochure'

const Home = ({url}) => {
  return (
    <div>
      <Navbar />
      <Header />
      <AboutUs />
      <ChitSchemes />
      <Benefits />
      <Team />
      <Testimonials />
      <Brochure url={url}/>
      <Footer />
    </div>
  )
}

export default Home
