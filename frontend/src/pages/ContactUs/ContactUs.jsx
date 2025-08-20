import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import Footer from '../../Components/Footer/Footer'
import Contact from '../../Components/Contact/Contact'
import Location from '../../Components/Contact/Location'

const ContactUs = () => {
  return (
    <div className='contact-us'>
       <Navbar />
       <Breadcrumb title="Contact Aastha Chits" />
       <Contact />
       <Location />
       <Footer />
    </div>
  )
}

export default ContactUs
